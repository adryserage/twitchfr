import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Streamer } from "@/types/twitch";
import { isAuthenticated, unauthorizedResponse } from "@/middleware/auth";
import { twitchClient } from "@/utils/twitchClient";
import type { NextRequest } from "next/server";

const dataFilePath = path.join(
  process.cwd(),
  "src",
  "data",
  "defaultStreamers.json",
);

async function readStreamersFile() {
  try {
    console.log("Reading streamers file from:", dataFilePath);
    const fileContent = await fs.readFile(dataFilePath, "utf-8");
    const data = JSON.parse(fileContent);
    console.log(
      "Successfully read streamers file, found streamers:",
      data.streamers.length,
    );
    return data;
  } catch (error) {
    console.error("Error reading streamers file:", error);
    // Return empty array instead of throwing to handle first-time use
    return { streamers: [] };
  }
}

async function writeStreamersFile(data: { streamers: Streamer[] }) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing streamers file:", error);
    return false;
  }
}

export async function GET() {
  try {
    console.log("GET /api/streamers - Starting request");
    const streamersData = await readStreamersFile();

    if (!streamersData || !streamersData.streamers) {
      console.error("Invalid data format in streamers file");
      // Return empty array instead of throwing
      return NextResponse.json({ streamers: [] });
    }

    console.log(
      "Initial data loaded, streamers count:",
      streamersData.streamers.length,
    );

    // Initialize Twitch client
    const client = await twitchClient.getClient();
    console.log("Twitch client initialized, updating streamer statuses...");

    // Update live status for all streamers
    const updatedStreamers = await Promise.all(
      streamersData.streamers.map(async (streamer: Streamer) => {
        try {
          console.log(`Checking status for streamer: ${streamer.displayName}`);
          const stream = await client.streams.getStreamByUserId(streamer.id);
          const updatedStreamer = {
            ...streamer,
            isLive: !!stream,
            title: stream?.title || streamer.title || "",
            gameName: stream?.gameName || streamer.gameName || "",
            viewerCount: stream?.viewers || 0,
            startedAt: stream?.startDate?.toISOString() || "",
          };
          console.log(
            `${streamer.displayName} is ${!!stream ? "live" : "offline"}`,
          );
          return updatedStreamer;
        } catch (error) {
          console.error(`Error updating streamer ${streamer.login}:`, error);
          return streamer;
        }
      }),
    );

    console.log(
      "All streamers updated, returning response with streamers:",
      updatedStreamers.length,
    );

    // Write back updated data
    await writeStreamersFile({ streamers: updatedStreamers });

    return NextResponse.json(
      { streamers: updatedStreamers },
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          Pragma: "no-cache",
        },
      },
    );
  } catch (error) {
    console.error("Error in GET /api/streamers:", error);
    return NextResponse.json(
      {
        error: "Failed to load streamers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return unauthorizedResponse();
    }

    const { streamer } = await request.json();
    let streamersData = await readStreamersFile();

    // Handle first-time use
    if (!streamersData || !streamersData.streamers) {
      streamersData = { streamers: [] };
    }

    // Check if streamer already exists
    if (streamersData.streamers.some((s: Streamer) => s.id === streamer.id)) {
      return NextResponse.json(
        { error: "Streamer already exists" },
        { status: 400 },
      );
    }

    streamersData.streamers.push(streamer);
    await writeStreamersFile(streamersData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/streamers:", error);
    return NextResponse.json(
      {
        error: "Failed to add streamer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return unauthorizedResponse();
    }

    const { streamerId } = await request.json();
    const streamersData = await readStreamersFile();

    // Handle first-time use
    if (!streamersData || !streamersData.streamers) {
      return NextResponse.json({ success: true });
    }

    const updatedStreamers = streamersData.streamers.filter(
      (s: Streamer) => s.id !== streamerId,
    );
    await writeStreamersFile({ streamers: updatedStreamers });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/streamers:", error);
    return NextResponse.json(
      {
        error: "Failed to remove streamer",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

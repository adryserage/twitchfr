import { NextResponse } from "next/server";
import { Streamer } from "@/types/twitch";
import { isAuthenticated, unauthorizedResponse } from "@/middleware/auth";
import { twitchClient } from "@/utils/twitchClient";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    console.log("GET /api/streamers - Starting request");
    const dbStreamers = await prisma.streamer.findMany();
    
    // Initialize Twitch client
    const client = await twitchClient.getClient();
    console.log("Twitch client initialized, updating streamer statuses...");

    // Update live status for all streamers
    const streamers = await Promise.all(
      dbStreamers.map(async (streamer) => {
        try {
          console.log(`Checking status for streamer: ${streamer.displayName}`);
          const stream = await client.streams.getStreamByUserId(streamer.id);
          
          return {
            ...streamer,
            isLive: !!stream,
            title: stream?.title || "",
            gameName: stream?.gameName || "",
            viewerCount: stream?.viewers || 0,
            startedAt: stream?.startDate?.toISOString() || "",
          };
        } catch (error) {
          console.error(`Error updating streamer ${streamer.displayName}:`, error);
          return {
            ...streamer,
            isLive: false,
            title: "",
            gameName: "",
            viewerCount: 0,
            startedAt: "",
          };
        }
      }),
    );

    return NextResponse.json(
      { streamers },
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          Pragma: "no-cache",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching streamers:", error);
    return NextResponse.json({ streamers: [] });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { login } = body;

    if (!login) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    const client = await twitchClient.getClient();
    const user = await client.users.getUserByName(login);

    if (!user) {
      return NextResponse.json(
        { error: "Streamer not found on Twitch" },
        { status: 404 },
      );
    }

    const existingStreamer = await prisma.streamer.findUnique({
      where: { id: user.id },
    });

    if (existingStreamer) {
      return NextResponse.json(
        { error: "Streamer already exists" },
        { status: 400 },
      );
    }

    const streamer = await prisma.streamer.create({
      data: {
        id: user.id,
        displayName: user.displayName,
        profileImageUrl: user.profilePictureUrl,
      },
    });

    return NextResponse.json({ streamer });
  } catch (error) {
    console.error("Error adding streamer:", error);
    return NextResponse.json(
      { error: "Failed to add streamer" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { streamerId } = body;

    if (!streamerId) {
      return NextResponse.json(
        { error: "Streamer ID is required" },
        { status: 400 },
      );
    }

    await prisma.streamer.delete({
      where: { id: streamerId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting streamer:", error);
    return NextResponse.json(
      { error: "Failed to delete streamer" },
      { status: 500 },
    );
  }
}

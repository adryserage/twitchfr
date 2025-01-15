import { NextResponse } from "next/server";
import { Streamer } from "@/types/twitch";
import { isAuthenticated, unauthorizedResponse } from "@/middleware/auth";
import { twitchClient } from "@/utils/twitchClient";
import type { NextRequest } from "next/server";
import { prisma, sql } from "@/lib/db";
import { rateLimiter } from "@/utils/rateLimiter";

export async function GET() {
  try {
    console.log("GET /api/streamers - Starting request");
    
    // Use raw SQL for better performance in serverless environment
    const dbStreamers = await sql<Streamer[]>`
      SELECT * FROM "Streamer"
      ORDER BY "lastUpdated" DESC
    `;
    
    // Initialize Twitch client
    const client = await twitchClient.getClient();
    console.log("Twitch client initialized, updating streamer statuses...");

    // Update live status for all streamers
    const streamers = await Promise.all(
      dbStreamers.map(async (streamer) => {
        try {
          console.log(`Checking status for streamer: ${streamer.displayName}`);
          const user = await client.users.getUserById(streamer.id);
          const stream = await client.streams.getStreamByUserId(streamer.id);
          
          return {
            ...streamer,
            login: user?.name || streamer.login,
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
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error in GET /api/streamers:", error);
    return NextResponse.json(
      { error: "Failed to fetch streamers" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!isAuthenticated(request)) {
      return unauthorizedResponse();
    }

    // Check rate limit
    if (!rateLimiter.canMakeCall("add_streamer")) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { streamer } = body as { streamer: Streamer };

    if (!streamer?.id || !streamer?.displayName || !streamer?.login) {
      return NextResponse.json(
        { error: "Invalid streamer data" },
        { status: 400 },
      );
    }

    // Check if streamer already exists using raw SQL
    const existingStreamer = await sql<Streamer[]>`
      SELECT * FROM "Streamer"
      WHERE id = ${streamer.id}
      LIMIT 1
    `;

    if (existingStreamer.length > 0) {
      return NextResponse.json(
        { error: "Streamer already exists" },
        { status: 409 },
      );
    }

    // Add streamer using raw SQL
    await sql`
      INSERT INTO "Streamer" (
        id,
        login,
        "displayName",
        "profileImageUrl",
        "addedAt",
        "lastUpdated"
      ) VALUES (
        ${streamer.id},
        ${streamer.login},
        ${streamer.displayName},
        ${streamer.profileImageUrl},
        ${new Date().toISOString()},
        ${new Date().toISOString()}
      )
    `;

    rateLimiter.recordCall("add_streamer");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/streamers:", error);
    return NextResponse.json(
      { error: "Failed to add streamer" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    if (!isAuthenticated(request)) {
      return unauthorizedResponse();
    }

    // Check rate limit
    if (!rateLimiter.canMakeCall("remove_streamer")) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { streamerId } = body as { streamerId: string };

    if (!streamerId) {
      return NextResponse.json(
        { error: "Streamer ID is required" },
        { status: 400 },
      );
    }

    // Delete streamer using raw SQL
    const result = await sql`
      DELETE FROM "Streamer"
      WHERE id = ${streamerId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Streamer not found" },
        { status: 404 },
      );
    }

    rateLimiter.recordCall("remove_streamer");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/streamers:", error);
    return NextResponse.json(
      { error: "Failed to remove streamer" },
      { status: 500 },
    );
  }
}

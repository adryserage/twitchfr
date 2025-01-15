import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Streamer } from "@/types/twitch";
import { isAuthenticated, unauthorizedResponse } from "@/middleware/auth";
import { twitchClient } from "@/utils/twitchClient";
import { StreamerService } from "@/services/streamerService";
import { LiveStatusService } from "@/services/liveStatusService";

// Initialize services
const streamerService = new StreamerService();
const liveStatusService = new LiveStatusService();

// Start live status updates
liveStatusService.startPeriodicUpdates();

export async function GET() {
  try {
    const streamers = await streamerService.getStreamers();
    return NextResponse.json({ streamers });
  } catch (error) {
    console.error("Error fetching streamers:", error);
    return NextResponse.json(
      { error: "Failed to fetch streamers" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const { streamerId } = await request.json();

    if (!streamerId) {
      return NextResponse.json(
        { error: "Streamer ID is required" },
        { status: 400 },
      );
    }

    // Get user data from Twitch
    const client = await twitchClient.getClient();
    const userData = await client.users.getUserById(streamerId);
    if (!userData) {
      return NextResponse.json(
        { error: "Streamer not found on Twitch" },
        { status: 404 },
      );
    }

    // Get stream data if user is live
    const stream = await client.streams.getStreamByUserId(streamerId);

    // Create streamer object
    const streamer: Streamer = {
      id: userData.id,
      login: userData.name,
      displayName: userData.displayName,
      profileImageUrl: userData.profilePictureUrl,
      isLive: !!stream,
      title: stream?.title,
      gameName: stream?.gameName,
      viewerCount: stream?.viewers,
      startedAt: stream?.startDate?.toISOString(),
    };

    // Add to database
    await streamerService.upsertStreamer(streamer);

    return NextResponse.json({ success: true, streamer });
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
    const { streamerId } = await request.json();

    if (!streamerId) {
      return NextResponse.json(
        { error: "Streamer ID is required" },
        { status: 400 },
      );
    }

    // Check if streamer exists
    const streamer = await streamerService.getStreamerById(streamerId);
    if (!streamer) {
      return NextResponse.json(
        { error: "Streamer not found" },
        { status: 404 },
      );
    }

    // Delete from database
    await streamerService.deleteStreamer(streamerId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting streamer:", error);
    return NextResponse.json(
      { error: "Failed to delete streamer" },
      { status: 500 },
    );
  }
}

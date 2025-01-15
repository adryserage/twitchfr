import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Streamer } from "@/types/twitch";
import { isAuthenticated, unauthorizedResponse } from "@/middleware/auth";
import { twitchClient } from "@/utils/twitchClient";
import { LiveStatusService } from "@/services/liveStatusService";
import { getCachedStreamers } from "@/lib/cache";
import { StreamerService } from "@/services/streamerService";

// Initialize services
const liveStatusService = new LiveStatusService();
const streamerService = new StreamerService();

// Start live status updates
liveStatusService.startPeriodicUpdates();

export async function GET() {
  try {
    // Get fresh data from the database
    const streamers = await streamerService.getStreamers();
    
    // Update cache for future requests
    await getCachedStreamers(async () => streamers);
    
    // Set cache control headers
    return NextResponse.json(
      { streamers },
      {
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      }
    );
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
    const userData = await client.users.getUserByName(streamerId);
    if (!userData) {
      return NextResponse.json(
        { error: "Streamer not found on Twitch" },
        { status: 404 },
      );
    }

    // Create streamer object
    const streamer: Streamer = {
      id: userData.id,
      login: userData.name,
      displayName: userData.displayName,
      profileImageUrl: userData.profilePictureUrl,
      isLive: false,
    };

    // Save to database
    await streamerService.upsertStreamer(streamer);

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
    const { streamerId } = await request.json();

    if (!streamerId) {
      return NextResponse.json(
        { error: "Streamer ID is required" },
        { status: 400 },
      );
    }

    await streamerService.deleteStreamer(streamerId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting streamer:", error);
    return NextResponse.json(
      { error: "Failed to delete streamer" },
      { status: 500 },
    );
  }
}

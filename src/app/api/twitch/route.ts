import { NextResponse } from "next/server";
import { TwitchAPIError, ErrorResponse } from "@/types/errors";
import { rateLimiter } from "@/utils/rateLimiter";
import { streamerCache } from "@/utils/cache";
import { twitchClient } from "@/utils/twitchClient";

export async function GET() {
  try {
    // Just await the initialization without storing the unused client
    await twitchClient.getClient();
    return NextResponse.json({ status: "initialized" });
  } catch (error) {
    if (error instanceof TwitchAPIError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
        } satisfies ErrorResponse,
        { status: error.status || 500 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to initialize Twitch API",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      } satisfies ErrorResponse,
        { status: 500 },
      );
    }
}

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    try {
      const normalizedUsername = username.toLowerCase();
      console.log(`Fetching info for streamer: ${username}`);

      // Use the new getOrFetch method which handles caching and deduplication
      const streamerData = await streamerCache.getOrFetch(
        normalizedUsername,
        async () => {
          // Check rate limit before making the actual API call
          if (!rateLimiter.canMakeCall(normalizedUsername)) {
            const waitTime =
              rateLimiter.getTimeUntilNextCall(normalizedUsername);
            throw new TwitchAPIError(
              "Rate limit exceeded",
              429,
              `Please wait ${Math.ceil(
                waitTime / 1000,
              )} seconds before requesting this streamer again`,
            );
          }

          const client = await twitchClient.getClient();
          const user = await client.users.getUserByName(username);

          if (!user) {
            throw new TwitchAPIError(
              `Streamer "${username}" not found`,
              404,
              undefined,
            );
          }

          // Record the API call after successful fetch
          rateLimiter.recordCall(normalizedUsername);

          return {
            id: user.id,
            login: user.name,
            displayName: user.displayName,
            profileImageUrl: user.profilePictureUrl,
          };
        },
      );

      return NextResponse.json(streamerData);
    } catch (error) {
      if (error instanceof TwitchAPIError) {
        return NextResponse.json(
          {
            error: error.message,
            details: error.details,
          } satisfies ErrorResponse,
          { status: error.status || 500 },
        );
      }

      console.error(
        "Twitch API call failed:",
        error instanceof Error ? error.message : error,
      );
      return NextResponse.json(
        {
          error: "Failed to fetch streamer info",
          details: error instanceof Error ? error.message : "API call failed",
        } satisfies ErrorResponse,
        { status: 500 },
      );
    }
  } catch (error) {
    console.error(
      "Error processing request:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "Invalid request" } satisfies ErrorResponse,
      { status: 400 },
    );
  }
}

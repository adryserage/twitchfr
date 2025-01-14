import { Streamer } from "@/types/twitch";
import { Cache } from "./cache";
import { rateLimiter } from "./rateLimiter";
import { twitchClient } from "./twitchClient";

const BATCH_SIZE = 10;
const streamerCache = new Cache<Streamer>(60); // 60 seconds cache

async function getStreamerInfo(streamerId: string): Promise<Streamer | null> {
  try {
    if (!rateLimiter.canMakeCall(streamerId)) {
      console.log(`Rate limit hit for streamer: ${streamerId}`);
      return null;
    }

    const client = await twitchClient.getClient();
    const user = await client.users.getUserById(streamerId);
    if (!user) {
      console.error(`User not found: ${streamerId}`);
      return null;
    }

    const stream = await client.streams.getStreamByUserId(streamerId);
    rateLimiter.recordCall(streamerId);

    return {
      id: user.id,
      displayName: user.displayName,
      profileImageUrl: user.profilePictureUrl,
      isLive: !!stream,
      title: stream?.title || "",
      gameName: stream?.gameName || "",
      viewerCount: stream?.viewers || 0,
      startedAt: stream?.startDate?.toISOString() || "",
      addedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching streamer info for ${streamerId}:`, error);
    return null;
  }
}

export async function updateStreamersStatus(
  streamers: Streamer[],
): Promise<Streamer[]> {
  try {
    console.log(`Updating status for ${streamers.length} streamers`);

    // Split streamers into batches to avoid rate limits
    const batches: Streamer[][] = [];
    for (let i = 0; i < streamers.length; i += BATCH_SIZE) {
      batches.push(streamers.slice(i, i + BATCH_SIZE));
    }

    let updatedStreamers: Streamer[] = [];
    for (const batch of batches) {
      const batchPromises = batch.map(async (streamer) => {
        // Check cache first
        const cachedStreamer = streamerCache.get(
          streamer.id,
        ) as Streamer | null;
        if (cachedStreamer) {
          console.log(`Cache hit for streamer: ${streamer.displayName}`);
          return cachedStreamer;
        }

        console.log(`Fetching info for streamer: ${streamer.displayName}`);
        const updatedStreamer = await getStreamerInfo(streamer.id);
        if (updatedStreamer) {
          streamerCache.set(streamer.id, updatedStreamer);
          return updatedStreamer;
        }
        return streamer;
      });

      const batchResults = await Promise.all(batchPromises);
      updatedStreamers = [...updatedStreamers, ...batchResults];
    }

    return updatedStreamers;
  } catch (error) {
    console.error("Error updating streamers status:", error);
    return streamers;
  }
}

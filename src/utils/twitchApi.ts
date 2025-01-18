import { Streamer } from "@/types/twitch";
import { streamerCache } from "./cache";

let isInitialized = false;

export const initializeTwitchApi = async (): Promise<void> => {
  try {
    const response = await fetch("/api/twitch");
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to initialize Twitch API");
    }
    isInitialized = true;
    console.log("Twitch API initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Twitch API:", error);
    throw error;
  }
};

export const getStreamerInfo = async (
  username: string,
): Promise<Streamer | null> => {
  if (!isInitialized) {
    throw new Error(
      "Twitch API not initialized. Please check your credentials.",
    );
  }

  // Check cache first
  const cachedStreamer = streamerCache.get(username) as Streamer | null;
  if (cachedStreamer) {
    console.log(`Cache hit for streamer: ${username}`);
    return cachedStreamer;
  }

  console.log(`Cache miss for streamer: ${username}, fetching from API...`);
  try {
    const response = await fetch("/api/twitch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const data = await response.json();
      throw new Error(data.error || "Failed to fetch streamer info");
    }

    const streamer = (await response.json()) as Streamer;
    streamerCache.set(username, streamer);
    return streamer;
  } catch (error) {
    console.error(`Error fetching streamer ${username}:`, error);
    return null;
  }
};

export const updateStreamersStatus = async (
  streamers: Streamer[],
): Promise<Streamer[]> => {
  if (!isInitialized) {
    throw new Error(
      "Twitch API not initialized. Please check your credentials.",
    );
  }

  try {
    // Process streamers in batches to avoid rate limits
    const batchSize = 5;
    const batches = [];
    for (let i = 0; i < streamers.length; i += batchSize) {
      batches.push(streamers.slice(i, i + batchSize));
    }

    let updatedStreamers: Streamer[] = [];
    for (const batch of batches) {
      const batchPromises = batch.map(async (streamer) => {
        // Check cache first
        const cachedStreamer = streamerCache.get(
          streamer.login,
        ) as Streamer | null;
        if (cachedStreamer) {
          console.log(`Cache hit for streamer: ${streamer.login}`);
          return cachedStreamer;
        }

        console.log(`Fetching info for streamer: ${streamer.login}`);
        const updatedStreamer = await getStreamerInfo(streamer.login);
        if (updatedStreamer) {
          streamerCache.set(streamer.login, updatedStreamer);
          return updatedStreamer;
        }
        return streamer;
      });

      const batchResults = await Promise.all(batchPromises);
      updatedStreamers = [...updatedStreamers, ...batchResults];

      // Add a small delay between batches to avoid rate limits
      if (batches.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return updatedStreamers;
  } catch (error) {
    console.error("Error updating streamer statuses:", error);
    return streamers;
  }
};

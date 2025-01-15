import { unstable_cache } from "next/cache";

export const CACHE_TAGS = {
  STREAMERS: "streamers",
  LIVE_STATUS: "live-status",
} as const;

export const CACHE_TIMES = {
  STREAMERS: 60 * 60, // 1 hour
  LIVE_STATUS: 60, // 1 minute
} as const;

export const getCachedStreamers = unstable_cache(
  async <T>(getStreamersFunc: () => Promise<T>): Promise<T> => {
    return getStreamersFunc();
  },
  ["streamers-list"],
  {
    tags: [CACHE_TAGS.STREAMERS],
    revalidate: CACHE_TIMES.STREAMERS,
  },
);

export const getCachedLiveStatus = unstable_cache(
  async <T>(getLiveStatusFunc: () => Promise<T>): Promise<T> => {
    return getLiveStatusFunc();
  },
  ["live-status"],
  {
    tags: [CACHE_TAGS.LIVE_STATUS],
    revalidate: CACHE_TIMES.LIVE_STATUS,
  },
);

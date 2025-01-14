export interface Streamer {
  id: string;
  displayName: string;
  profileImageUrl: string;
  addedAt: string;
  lastUpdated: string;
  // Runtime-only fields
  isLive?: boolean;
  title?: string;
  gameName?: string;
  viewerCount?: number;
  startedAt?: string;
}

export interface StreamerStore {
  streamers: Streamer[];
  setStreamers: (streamers: Streamer[]) => void;
  addStreamer: (streamer: Streamer) => Promise<void>;
  removeStreamer: (streamerId: string) => Promise<void>;
  updateStreamerStatus: (
    streamerId: string,
    isLive: boolean,
    liveData?: Partial<Streamer>,
  ) => void;
}

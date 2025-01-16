export interface Streamer {
  id: string;
  login: string;
  displayName: string;
  profileImageUrl: string;
  addedAt: Date;
  lastLiveCheck: Date;
  updatedAt: Date;
  isLive: boolean;
  viewerCount?: number;
  gameName?: string;
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

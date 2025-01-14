export interface Streamer {
  id: string;
  login: string;
  displayName: string;
  profileImageUrl: string;
  isLive: boolean;
  title?: string;
  gameName?: string;
  viewerCount?: number;
  startedAt?: string;
  addedAt?: string;
}

export interface StreamerStore {
  streamers: Streamer[];
  setStreamers: (streamers: Streamer[]) => void;
  addStreamer: (streamer: Streamer) => Promise<void>;
  removeStreamer: (streamerId: string) => Promise<void>;
  updateStreamerStatus: (
    streamerId: string,
    isLive: boolean,
    liveData?: Partial<Streamer>
  ) => void;
}

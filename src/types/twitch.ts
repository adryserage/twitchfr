export interface Streamer {
  id: string;
  login: string;
  displayName: string;
  profileImageUrl: string;
  addedAt: string;
  lastUpdated: string;
  // Runtime-only fields - default to false/empty when undefined
  isLive: boolean;
  title: string;
  gameName: string;
  viewerCount: number;
  startedAt: string;
}

export interface StreamerStore {
  streamers: Streamer[];
  isLoading: boolean;
  error: string | null;
  setStreamers: (streamers: Streamer[]) => void;
  addStreamer: (streamer: Streamer) => Promise<void>;
  removeStreamer: (streamerId: string) => Promise<void>;
  updateStreamerStatus: (
    streamerId: string,
    isLive: boolean,
    liveData?: Partial<Streamer>,
  ) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

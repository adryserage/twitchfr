import { create } from "zustand";
import type { Streamer } from "@/types/twitch";

interface IStreamerStore {
  streamers: Streamer[];
  setStreamers: (streamers: Streamer[]) => void;
  addStreamer: (streamer: Streamer) => Promise<void>;
  removeStreamer: (streamerId: string) => Promise<void>;
  updateStreamerStatus: (streamerId: string, isLive: boolean, liveData?: Partial<Streamer>) => void;
}

export const useStreamerStore = create<IStreamerStore>((set) => ({
  streamers: [],

  setStreamers: (streamers) => {
    console.log("StreamerStore: Setting streamers:", streamers);
    set({ streamers });
  },

  addStreamer: async (streamer) => {
    console.log("StreamerStore: Adding streamer:", streamer);
    return new Promise((resolve) => {
      set((state) => ({
        streamers: [...state.streamers, streamer],
      }));
      resolve();
    });
  },

  removeStreamer: async (streamerId) => {
    console.log("StreamerStore: Removing streamer:", streamerId);
    return new Promise<void>((resolve) => {
      set((state) => ({
        streamers: state.streamers.filter((s) => s.id !== streamerId),
      }));
      resolve();
    });
  },

  updateStreamerStatus: (streamerId, isLive, liveData) => {
    console.log("StreamerStore: Updating streamer status:", { streamerId, isLive, liveData });
    set((state) => ({
      streamers: state.streamers.map((streamer) =>
        streamer.id === streamerId
          ? { ...streamer, ...liveData }
          : streamer
      ),
    }));
  },
}));

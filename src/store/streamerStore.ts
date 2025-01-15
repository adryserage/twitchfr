import { create } from "zustand";
import { StreamerStore } from "@/types/twitch";

export const useStreamerStore = create<StreamerStore>()((set) => ({
  streamers: [],
  
  setStreamers: (streamers) => {
    console.log('StreamerStore: Setting streamers:', streamers);
    set({ streamers });
  },
  
  addStreamer: async (streamer) => {
    console.log('StreamerStore: Adding streamer:', streamer);
    set((state) => ({
      streamers: [...state.streamers, streamer],
    }));
  },

  removeStreamer: async (streamerId) => {
    console.log('StreamerStore: Removing streamer:', streamerId);
    set((state) => ({
      streamers: state.streamers.filter((s) => s.id !== streamerId),
    }));
  },

  updateStreamerStatus: (streamerId, isLive, liveData) => {
    set((state) => ({
      streamers: state.streamers.map((streamer) =>
        streamer.id === streamerId
          ? { ...streamer, isLive, ...liveData }
          : streamer
      ),
    }));
  },
}));

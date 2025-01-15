import { create } from "zustand";
import { StreamerStore } from "@/types/twitch";

export const useStreamerStore = create<StreamerStore>()((set) => ({
  streamers: [],
  
  setStreamers: (streamers) => {
    console.log('StreamerStore: Setting streamers:', streamers);
    set({ streamers });
  },
  
  addStreamer: async (streamer) => {
    try {
      console.log('StreamerStore: Adding streamer:', streamer);
      const response = await fetch('/api/streamers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ streamer }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add streamer');
      }

      set((state) => ({
        streamers: [...state.streamers, streamer],
      }));
      console.log('StreamerStore: Streamer added successfully');
    } catch (error) {
      console.error('StreamerStore: Error adding streamer:', error);
      throw error;
    }
  },

  removeStreamer: async (streamerId) => {
    try {
      console.log('StreamerStore: Removing streamer:', streamerId);
      const response = await fetch('/api/streamers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ streamerId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove streamer');
      }

      set((state) => ({
        streamers: state.streamers.filter((s) => s.id !== streamerId),
      }));
      console.log('StreamerStore: Streamer removed successfully');
    } catch (error) {
      console.error('StreamerStore: Error removing streamer:', error);
      throw error;
    }
  },

  updateStreamerStatus: (streamerId, isLive, liveData) => {
    console.log('StreamerStore: Updating streamer status:', { streamerId, isLive, liveData });
    set((state) => ({
      streamers: state.streamers.map((s) =>
        s.id === streamerId
          ? { ...s, isLive, ...liveData }
          : s
      ),
    }));
  },
}));

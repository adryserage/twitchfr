import { create } from "zustand";
import { StreamerStore } from "@/types/twitch";

export const useStreamerStore = create<StreamerStore>()((set) => ({
  streamers: [],
  isLoading: false,
  error: null,
  
  setStreamers: (streamers) => {
    console.log('StreamerStore: Setting streamers:', streamers);
    set({ streamers, error: null });
  },

  setError: (error) => {
    console.error('StreamerStore: Error:', error);
    set({ error });
  },

  setLoading: (isLoading) => {
    console.log('StreamerStore: Setting loading:', isLoading);
    set({ isLoading });
  },
  
  addStreamer: async (streamer) => {
    try {
      set({ isLoading: true, error: null });
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
        error: null,
      }));
      console.log('StreamerStore: Streamer added successfully');
    } catch (error) {
      console.error('StreamerStore: Error adding streamer:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to add streamer' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeStreamer: async (streamerId) => {
    try {
      set({ isLoading: true, error: null });
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
        error: null,
      }));
      console.log('StreamerStore: Streamer removed successfully');
    } catch (error) {
      console.error('StreamerStore: Error removing streamer:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to remove streamer' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateStreamerStatus: (streamerId, isLive, liveData = {}) => {
    set((state) => ({
      streamers: state.streamers.map((streamer) =>
        streamer.id === streamerId
          ? {
              ...streamer,
              isLive,
              title: liveData.title ?? streamer.title ?? '',
              gameName: liveData.gameName ?? streamer.gameName ?? '',
              viewerCount: liveData.viewerCount ?? streamer.viewerCount ?? 0,
              startedAt: liveData.startedAt ?? streamer.startedAt ?? '',
            }
          : streamer,
      ),
    }));
  },
}));

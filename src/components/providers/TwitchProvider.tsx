'use client';

import { useEffect } from 'react';
import { initializeTwitchApi } from '@/utils/twitchApi';
import { useStreamerStore } from '@/store/streamerStore';

export function TwitchProvider({ children }: { children: React.ReactNode }) {
  const setStreamers = useStreamerStore((state) => state.setStreamers);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('TwitchProvider: Initializing...');
        await initializeTwitchApi();
        
        // Load default streamers
        console.log('TwitchProvider: Loading default streamers...');
        const response = await fetch('/api/streamers');
        if (!response.ok) {
          throw new Error('Failed to load default streamers');
        }
        
        const data = await response.json();
        console.log('TwitchProvider: Loaded streamers:', data);
        
        if (data && Array.isArray(data.streamers)) {
          setStreamers(data.streamers);
        } else {
          console.error('TwitchProvider: Invalid data format:', data);
        }
      } catch (error) {
        console.error('TwitchProvider: Initialization error:', error);
      }
    };
    init();
  }, [setStreamers]);

  return <>{children}</>;
}

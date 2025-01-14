'use client';

import { useEffect } from 'react';
import { useStreamerStore } from '@/store/streamerStore';

export function TwitchProvider({ children }: { children: React.ReactNode }) {
  const setStreamers = useStreamerStore((state) => state.setStreamers);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('TwitchProvider: Loading streamers...');
        const response = await fetch('/api/streamers');
        if (!response.ok) {
          throw new Error('Failed to load streamers');
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

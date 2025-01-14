'use client';

import { FC } from 'react';
import { useStreamerStore } from '@/store/streamerStore';
import { AddStreamerForm } from './AddStreamerForm';
import { StreamerCard } from './StreamerCard';

export const AddStreamerPage: FC = () => {
  const streamers = useStreamerStore((state) => state.streamers);
  
  // Get the 5 most recently added streamers
  const recentStreamers = [...streamers]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Add Form */}
      <AddStreamerForm />

      {/* Recent Streamers */}
      {recentStreamers.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {recentStreamers.map((streamer) => (
            <StreamerCard key={streamer.id} streamer={streamer} />
          ))}
        </div>
      )}
    </div>
  );
};

"use client";

import { FC } from "react";
import Image from "next/image";

interface StreamerCardProps {
  streamer: {
    id: string;
    login: string;
    displayName: string;
    profileImageUrl: string;
  };
}

export const StreamerCard: FC<StreamerCardProps> = ({ streamer }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
      <div className="relative w-16 h-16">
        <Image
          src={streamer.profileImageUrl}
          alt={streamer.displayName}
          fill
          className="rounded-full object-cover"
          sizes="(max-width: 768px) 64px, 64px"
          priority
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{streamer.displayName}</h3>
        <a
          href={`https://twitch.tv/${streamer.login}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-800"
          title="Voir sur Twitch"
        >
          @{streamer.login}
        </a>
      </div>
    </div>
  );
};

"use client";

import { FC } from "react";
import Image from "next/image";
import { Streamer } from "@/types/twitch";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ExternalLink } from "lucide-react";

interface StreamerCardProps {
  streamer: Streamer;
}

export const StreamerCard: FC<StreamerCardProps> = ({ streamer }) => {
  const getUptime = () => {
    if (!streamer.startedAt) return "";
    return formatDistanceToNow(new Date(streamer.startedAt), {
      addSuffix: true,
      locale: fr,
    });
  };

  return (
    <div
      className={`relative rounded-lg border ${
        streamer.isLive
          ? "border-green-500 dark:border-green-400"
          : "border-gray-200 dark:border-gray-700"
      } bg-white dark:bg-gray-800 overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src={streamer.profileImageUrl}
                alt={streamer.displayName}
                width={48}
                height={48}
                className="rounded-full"
              />
              {streamer.isLive && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {streamer.displayName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {streamer.login}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <a
              href={`https://twitch.tv/${streamer.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
              title="Voir sur Twitch"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        {streamer.isLive && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-900 dark:text-white font-medium line-clamp-2">
              {streamer.title}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {streamer.gameName}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {streamer.viewerCount?.toLocaleString()} spectateurs
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              En ligne {getUptime()}
            </p>
          </div>
        )}

        {!streamer.isLive && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hors ligne
            </p>
          </div>
        )}
      </div>

      {streamer.isLive && (
        <a
          href={`https://twitch.tv/${streamer.login}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 text-sm font-medium transition-colors"
        >
          Regarder le stream
        </a>
      )}
    </div>
  );
};

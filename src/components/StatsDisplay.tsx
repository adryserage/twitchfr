"use client";

import { FC } from "react";
import { useStreamerStore } from "@/store/streamerStore";

export const StatsDisplay: FC<{ type?: "online" | "list" }> = ({
  type = "list",
}) => {
  const streamers = useStreamerStore((state) => state.streamers);
  const onlineStreamers = streamers.filter((s) => s.isLive);

  const calculateStats = () => {
    if (type === "online") {
      const totalViewers = onlineStreamers.reduce(
        (acc, s) => acc + (s.viewerCount || 0),
        0,
      );
      const categories = onlineStreamers.reduce((acc, s) => {
        if (s.gameName) {
          acc[s.gameName] = (acc[s.gameName] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const mostPopularCategory =
        Object.entries(categories).sort(([, a], [, b]) => b - a)[0]?.[0] ||
        "Aucun";

      const averageUptime =
        onlineStreamers.length > 0
          ? onlineStreamers.reduce((acc, s) => {
              if (s.startedAt) {
                const uptime = Date.now() - new Date(s.startedAt).getTime();
                return acc + uptime;
              }
              return acc;
            }, 0) / onlineStreamers.length
          : 0;

      const hours = Math.floor(averageUptime / (1000 * 60 * 60));
      const minutes = Math.floor(
        (averageUptime % (1000 * 60 * 60)) / (1000 * 60),
      );

      return {
        totalViewers: totalViewers.toLocaleString(),
        mostPopularCategory,
        averageUptime:
          onlineStreamers.length > 0 ? `${hours}h ${minutes}m` : "N/A",
        liveCount: onlineStreamers.length,
      };
    }

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const addedThisWeek = streamers.filter((s) => {
      // If addedAt is not available, assume it was added now
      const addedDate = new Date(s.addedAt || Date.now());
      return addedDate > weekAgo;
    }).length;

    return {
      totalStreamers: streamers.length,
      onlineNow: onlineStreamers.length,
      addedThisWeek,
    };
  };

  const stats = calculateStats();

  if (type === "online") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Spectateurs totaux
          </h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.totalViewers}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Catégorie la plus populaire
          </h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.mostPopularCategory}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Temps moyen en ligne
          </h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.averageUptime}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Streamers en direct
          </h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {stats.liveCount}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total des streamers
        </h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
          {stats.totalStreamers}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          En ligne maintenant
        </h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
          {stats.onlineNow}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Ajoutés cette semaine
        </h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
          {stats.addedThisWeek}
        </p>
      </div>
    </div>
  );
};

"use client";

import { useEffect, useState } from "react";
import { useStreamerStore } from "@/store/streamerStore";
import { StreamerCard } from "./StreamerCard";
import { updateStreamersStatus } from "@/utils/twitchApi";
import { AddStreamerPage } from "./AddStreamerPage";
import { usePathname } from "next/navigation";

interface StreamerListProps {
  showOnlineOnly?: boolean;
}

const StreamerList = ({ showOnlineOnly }: StreamerListProps = {}) => {
  const pathname = usePathname();
  const streamers = useStreamerStore((state) => state.streamers);
  const updateStreamerStatus = useStreamerStore(
    (state) => state.updateStreamerStatus,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(0);

  useEffect(() => {
    console.log("StreamerList: Current streamers:", streamers);
    const updateStatus = async () => {
      if (streamers.length === 0) {
        console.log("StreamerList: No streamers to update");
        setIsLoading(false);
        return;
      }

      // Check if we need to update (every 30 seconds)
      const now = Date.now();
      if (now - lastUpdate < 30000) {
        console.log("StreamerList: Skipping update, too soon");
        setIsLoading(false);
        return;
      }

      try {
        console.log("StreamerList: Updating streamer statuses...");
        const updatedStreamers = await updateStreamersStatus(streamers);
        console.log("StreamerList: Updated streamers:", updatedStreamers);
        updatedStreamers.forEach((streamer) => {
          updateStreamerStatus(streamer.id, streamer.isLive, {
            title: streamer.title,
            gameName: streamer.gameName,
            viewerCount: streamer.viewerCount,
            startedAt: streamer.startedAt,
          });
        });
        setLastUpdate(now);
      } catch (error) {
        console.error("StreamerList: Error updating streamer status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial update
    updateStatus();

    // Set up interval for updates
    const interval = setInterval(updateStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [streamers, updateStreamerStatus, lastUpdate]);

  // Show AddStreamerPage on the add page
  if (pathname === "/add") {
    return <AddStreamerPage />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  console.log("StreamerList: Filtering streamers...", {
    showOnlineOnly,
    pathname,
    totalStreamers: streamers.length,
    liveStreamers: streamers.filter((s) => s.isLive).length,
  });

  // Filter streamers based on showOnlineOnly prop or current page
  const filteredStreamers =
    showOnlineOnly || pathname === "/"
      ? streamers.filter((streamer) => streamer.isLive)
      : streamers;

  // Limit the number of streamers shown on the home page
  const displayedStreamers =
    pathname === "/" ? filteredStreamers.slice(0, 6) : filteredStreamers;

  console.log("StreamerList: Final streamers to display:", {
    filtered: filteredStreamers.length,
    displayed: displayedStreamers.length,
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedStreamers.map((streamer) => (
          <StreamerCard key={streamer.id} streamer={streamer} />
        ))}
        {displayedStreamers.length === 0 && streamers.length > 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            {showOnlineOnly || pathname === "/"
              ? "No streamers are currently live"
              : "No streamers match your filters"}
          </div>
        )}
        {streamers.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            No streamers added yet
          </div>
        )}
      </div>
    </div>
  );
};

export { StreamerList };
export default StreamerList;

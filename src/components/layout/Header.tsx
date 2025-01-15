"use client";

import { useStreamerStore } from "@/store/streamerStore";
import { RefreshCw, Search } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const streamers = useStreamerStore((state) => state.streamers);
  const setStreamers = useStreamerStore((state) => state.setStreamers);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/streamers", {
        next: {
          revalidate: 0, // Bypass cache
          tags: ["streamers", "live-status"],
        },
      });

      if (!response.ok) {
        throw new Error("Failed to refresh streamers");
      }

      const data = await response.json();
      if (!data || !data.streamers) {
        throw new Error("Invalid response format");
      }

      setStreamers(data.streamers);
    } catch (error) {
      console.error("Error refreshing streamers:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Implement search logic here using the streamer store
  };

  return (
    <header className="fixed top-0 right-0 left-16 h-16 bg-background border-b z-50 flex items-center px-4 gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search streamers..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="p-2 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
        title="Refresh streamers"
      >
        <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
      </button>
    </header>
  );
}

"use client";

import { useState, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import { useStreamerStore } from "@/store/streamerStore";
import { Streamer } from "@/types/twitch";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const streamers = useStreamerStore((state) => state.streamers);
  const setStreamers = useStreamerStore((state) => state.setStreamers);
  const [originalStreamers, setOriginalStreamers] = useState<Streamer[]>([]);

  // Initialize originalStreamers when streamers change
  useEffect(() => {
    if (streamers.length > 0 && originalStreamers.length === 0) {
      setOriginalStreamers(streamers);
    }
  }, [streamers, originalStreamers]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setStreamers(originalStreamers);
        return;
      }

      const normalizedQuery = query.toLowerCase().trim();
      const filteredStreamers = originalStreamers.filter(
        (streamer: Streamer) => {
          return (
            streamer.displayName.toLowerCase().includes(normalizedQuery) ||
            streamer.login.toLowerCase().includes(normalizedQuery) ||
            (streamer.title &&
              streamer.title.toLowerCase().includes(normalizedQuery)) ||
            (streamer.gameName &&
              streamer.gameName.toLowerCase().includes(normalizedQuery))
          );
        },
      );

      setStreamers(filteredStreamers);
    },
    [originalStreamers, setStreamers],
  );

  return (
    <header className="fixed top-0 left-16 right-0 h-14 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full w-full px-4">
        <div className="flex flex-1 items-center">
          <div className="w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search streamers..."
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

"use client";

import dynamic from "next/dynamic";
import { ReactNode, useEffect } from "react";
import { useStreamerStore } from "@/store/streamerStore";
import type { StreamerStore } from "@/types/twitch";
import { useRouter } from "next/navigation";

const StreamerList = dynamic(
  () => import("@/components/StreamerList").then((mod) => mod.StreamerList),
  { ssr: false },
);
const Sidebar = dynamic(() => import("@/components/layout/Sidebar"), {
  ssr: false,
});
const Header = dynamic(() => import("@/components/layout/Header"), {
  ssr: false,
});
const AddStreamerPage = dynamic(
  () =>
    import("@/components/AddStreamerPage").then((mod) => mod.AddStreamerPage),
  { ssr: false },
);

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <Header />
      <main className="ml-16 pt-16 h-screen overflow-y-auto">{children}</main>
    </div>
  );
}

export function ClientWrapper({ children }: { children: ReactNode }) {
  const setStreamers = useStreamerStore(
    (state: StreamerStore) => state.setStreamers,
  );
  const router = useRouter();

  useEffect(() => {
    const loadStreamers = async () => {
      try {
        console.log("ClientWrapper: Starting to fetch streamers...");
        const response = await fetch("/api/streamers", {
          next: {
            revalidate: 60, // Cache for 1 minute
            tags: ["streamers", "live-status"],
          },
        });

        if (!response.ok) {
          console.error(
            "ClientWrapper: Failed to load streamers, status:",
            response.status,
          );
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load streamers");
        }

        const data = await response.json();
        if (!data || !data.streamers) {
          throw new Error("Invalid response format");
        }

        setStreamers(data.streamers);
      } catch (error) {
        console.error("ClientWrapper: Error loading streamers:", error);
      }
    };

    loadStreamers();

    // Set up periodic refresh
    const refreshInterval = setInterval(() => {
      router.refresh();
    }, 60000); // Refresh every minute

    return () => clearInterval(refreshInterval);
  }, [setStreamers, router]);

  return <>{children}</>;
}

export { StreamerList, AddStreamerPage };

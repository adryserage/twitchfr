import { Suspense } from "react";
import { ClientLayout, StreamerList } from "@/components/ClientWrapper";
import { Radio } from "lucide-react";
import { StatsDisplay } from "@/components/StatsDisplay";

export default function Home() {
  return (
    <ClientLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Radio className="w-6 h-6 text-green-500 dark:text-green-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Streamers en ligne
          </h1>
        </div>

        {/* Stats Display */}
        <div className="mb-8">
          <StatsDisplay type="online" />
        </div>

        {/* Online Streamers Grid */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          }
        >
          <StreamerList showOnlineOnly />
        </Suspense>
      </div>
    </ClientLayout>
  );
}

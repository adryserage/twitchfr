import { Suspense } from "react";
import { ClientLayout, StreamerList } from "@/components/ClientWrapper";
import { Users } from "lucide-react";
import { StatsDisplay } from "@/components/StatsDisplay";

export default function StreamersListPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-500 dark:text-blue-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tous les streamers
            </h1>
          </div>
        </div>

        {/* Stats Display */}
        <div className="mb-8">
          <StatsDisplay />
        </div>

        {/* All Streamers Grid */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          }>
          <StreamerList />
        </Suspense>
      </div>
    </ClientLayout>
  );
}

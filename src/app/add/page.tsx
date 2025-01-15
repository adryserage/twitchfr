import { Suspense } from "react";
import { ClientLayout, StreamerList } from "@/components/ClientWrapper";
import { UserPlus } from "lucide-react";

export default function AddStreamerPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <UserPlus className="w-6 h-6 text-purple-500 dark:text-purple-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ajouter un nouveau streamer
            </h1>
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
              Comment ajouter un streamer
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="font-medium mr-2">1.</span>
                Entrer le nom d&apos;utilisateur de Twitch du streamer que vous
                souhaitez ajouter
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">2.</span>
                Cliquez sur le bouton &quot;Ajouter un streamer&quot;
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">3.</span>
                Le streamer apparaitra dans votre liste si il existe sur Twitch
              </li>
            </ul>
          </div>

          {/* Add Streamer Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <Suspense
              fallback={
                <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
              }
            >
              <StreamerList />
            </Suspense>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

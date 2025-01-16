'use client';
 
import { useEffect } from 'react';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
 
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <h2 className="text-2xl font-bold mb-4">Une erreur est survenue</h2>
          <p className="text-gray-600 mb-6">Nous nous excusons pour ce problème.</p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}

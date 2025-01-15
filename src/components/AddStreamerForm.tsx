"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStreamerStore } from "@/store/streamerStore";
import { Streamer } from "@/types/twitch";

interface FormState {
  username: string;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

interface ApiError {
  error: string;
  details?: string;
}

export function AddStreamerForm() {
  const router = useRouter();
  const addStreamer = useStreamerStore((state) => state.addStreamer);
  const [formState, setFormState] = useState<FormState>({
    username: "",
    isLoading: false,
    error: null,
    success: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formState.username.trim()) {
      setFormState((prev) => ({
        ...prev,
        error: "Le nom d'utilisateur est requis",
      }));
      return;
    }

    setFormState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      success: false,
    }));

    try {
      const response = await fetch("/api/twitch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: formState.username }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiError;
        throw new Error(errorData.details || errorData.error);
      }

      const streamerData = (await response.json()) as Streamer;

      // Add streamer to the database
      const dbResponse = await fetch("/api/streamers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamer: streamerData }),
      });

      if (!dbResponse.ok) {
        const errorData = (await dbResponse.json()) as ApiError;
        throw new Error(errorData.details || errorData.error);
      }

      // Update local state
      addStreamer(streamerData);

      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        success: true,
        username: "",
      }));

      // Redirect to the streamers list page after a short delay
      setTimeout(() => {
        router.push("/list");
      }, 1500);
    } catch (error: unknown) {
      console.error("Error adding streamer:", error);
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Une erreur est survenue",
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Nom d&apos;utilisateur Twitch
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="username"
            id="username"
            value={formState.username}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, username: e.target.value }))
            }
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="xqc"
            disabled={formState.isLoading}
          />
        </div>
      </div>

      {formState.error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {formState.error}
        </div>
      )}

      {formState.success && (
        <div className="text-sm text-green-600 dark:text-green-400">
          Streamer ajouté avec succès! Redirection...
        </div>
      )}

      <button
        type="submit"
        disabled={formState.isLoading || formState.success}
        className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {formState.isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Ajout en cours...
          </>
        ) : (
          "Ajouter le streamer"
        )}
      </button>
    </form>
  );
}
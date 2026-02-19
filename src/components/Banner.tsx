"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { PlayIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { IMAGE_BASE_URL, type Media, fetchTrending } from "@/lib/tmdb";

function truncate(text: string | undefined, max: number): string {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export default function Banner() {
  // Banner now owns its own loading/error state and calls the TMDB helpers
  // directly. This keeps React hooks inside components rather than lib files.
  const [featured, setFeatured] = useState<Media | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const results = await fetchTrending();
        if (!cancelled && results.length > 0) {
          const randomIndex = Math.floor(Math.random() * results.length);
          setFeatured(results[randomIndex] ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Unknown error occurred";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const backgroundPath = useMemo(
    () => featured?.backdrop_path ?? featured?.poster_path ?? null,
    [featured],
  );

  const title =
    featured?.title ?? featured?.name ?? featured?.original_name ?? "";

  return (
    <section className="relative mb-6 h-[70vh] w-full overflow-hidden md:mb-10">
      <div className="absolute inset-0">
        {backgroundPath && (
          <Image
            src={`${IMAGE_BASE_URL}${backgroundPath}`}
            alt={title || "Featured"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-center px-4 pb-24 pt-32 sm:px-8 md:px-14 md:pt-40 lg:max-w-2xl">
        {loading ? (
          <div className="space-y-4">
            <div className="h-10 w-2/3 animate-pulse rounded bg-zinc-900/80" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-900/80" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-900/80" />
            <div className="mt-4 flex gap-3">
              <div className="h-10 w-28 animate-pulse rounded bg-zinc-900/80" />
              <div className="h-10 w-32 animate-pulse rounded bg-zinc-900/80" />
            </div>
          </div>
        ) : error ? (
          <p className="text-sm text-red-400 md:text-base">
            Failed to load featured title: {error}
          </p>
        ) : (
          <>
            <h1 className="mb-3 max-w-xl text-3xl font-extrabold text-white drop-shadow-lg sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="max-w-xl text-sm text-zinc-200 drop-shadow sm:text-base md:text-lg">
              {truncate(featured?.overview, 150)}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded bg-white px-5 py-2 text-sm font-semibold text-black shadow-md transition hover:bg-neutral-200 md:px-6 md:py-2.5 md:text-base"
              >
                <PlayIcon className="h-5 w-5" />
                Play
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded bg-zinc-700/80 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-zinc-600/80 md:px-6 md:py-2.5 md:text-base"
              >
                <InformationCircleIcon className="h-5 w-5" />
                More Info
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}


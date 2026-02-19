"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import { fetchByGenre, fetchTopRated, fetchTrending, type Media } from "@/lib/tmdb";

// Row is a client component that owns its own loading and error state.
// This keeps React hooks inside components and leaves lib/tmdb.ts as a pure
// data-fetching utility module.

type Category =
  | "trending"
  | "topRated"
  | "action"
  | "comedy"
  | "horror"
  | "romance"
  | "documentary";

type Props = {
  title: string;
  category: Category;
};

export default function Row({ title, category }: Props) {
  const [data, setData] = useState<Media[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        let results: Media[] = [];

        switch (category) {
          case "trending":
            results = await fetchTrending();
            break;
          case "topRated":
            results = await fetchTopRated();
            break;
          case "action":
            results = await fetchByGenre(28);
            break;
          case "comedy":
            results = await fetchByGenre(35);
            break;
          case "horror":
            results = await fetchByGenre(27);
            break;
          case "romance":
            results = await fetchByGenre(10749);
            break;
          case "documentary":
            results = await fetchByGenre(99);
            break;
        }

        if (!cancelled) {
          setData(results);
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
  }, [category]);

  return (
    <section className="space-y-2 md:space-y-3">
      <h2 className="text-sm font-semibold text-zinc-100 md:text-lg">
        {title}
      </h2>
      <div className="relative">
        {loading ? (
          <div className="flex space-x-2 overflow-hidden py-1">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="h-32 w-24 animate-pulse rounded-md bg-zinc-900/80 sm:h-40 sm:w-32 md:h-48 md:w-36"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-xs text-red-400 md:text-sm">
            Failed to load: {error}
          </p>
        ) : (
          <div className="scrollbar-hide flex space-x-2 overflow-x-scroll pb-20 pt-6">
            {data.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


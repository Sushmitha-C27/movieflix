'use client';

import Image from "next/image";
import { useState } from "react";
import type { Media } from "@/lib/tmdb";
import { IMAGE_BASE_URL, fetchMovieVideo } from "@/lib/tmdb";

type Props = {
  movie: Media;
};

export default function MovieCard({ movie }: Props) {
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const title =
    movie.title ?? movie.name ?? movie.original_name ?? "Untitled";

  const imagePath = movie.poster_path ?? movie.backdrop_path;

  if (!imagePath) return null;

  // 🔥 fetch video only on hover
  const handleHover = async () => {
    setIsHovered(true);

    if (!videoKey) {
      const key = await fetchMovieVideo(movie.id);
      if (key) setVideoKey(key);
    }
  };

  return (
    <div
      className="group relative min-w-[140px] cursor-pointer"
      onMouseEnter={handleHover}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* NORMAL IMAGE */}
      {!isHovered && (
        <div className="relative aspect-[2/3] overflow-hidden rounded-md">
          <Image
            src={`${IMAGE_BASE_URL}${imagePath}`}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* 🔥 VIDEO PREVIEW */}
      {isHovered && videoKey && (
        <div className="absolute top-0 left-0 z-30 w-[300px] rounded-lg overflow-hidden shadow-2xl">
          
          {/* VIDEO */}
          <iframe
            className="w-full h-[170px]"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoKey}`}
            allow="autoplay"
          />

          {/* INFO */}
          <div className="bg-zinc-900 p-3 text-white">
            <div className="flex gap-2">
              <button className="bg-white text-black text-xs px-3 py-1 rounded">
                ▶ Play
              </button>

              <button className="bg-gray-600 text-xs px-3 py-1 rounded">
                Info
              </button>
            </div>

            <h3 className="mt-2 text-sm font-semibold">{title}</h3>

            <p className="mt-1 text-xs text-gray-400 line-clamp-3">
              {movie.overview}
            </p>
          </div>
        </div>
      )}

      {/* TITLE */}
      <h3 className="mt-1 text-xs text-zinc-200 line-clamp-1">
        {title}
      </h3>
    </div>
  );
}

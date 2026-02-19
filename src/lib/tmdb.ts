// NOTE: This file is intentionally kept free of React hooks.
// It only contains small, reusable TMDB API helper functions that can be used
// from both server and client components without pulling in React.
//
// The TMDB API key is read from process.env.NEXT_PUBLIC_TMDB_API_KEY.
// - Put your real key in a local ".env.local" file (see .env.example).
// - Never hardcode secrets in source files or commit them to git.

const BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!API_KEY) {
  // Log a clear message during development if the API key is missing.
  // This helps beginners understand why TMDB requests are failing.
  // eslint-disable-next-line no-console
  console.error(
    'TMDB API key is missing. Set NEXT_PUBLIC_TMDB_API_KEY in your ".env.local" file.',
  );
}

export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original/";

export type Media = {
  id: number;
  title?: string;
  name?: string;
  original_name?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  media_type?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};

type TmdbListResponse = {
  page: number;
  results: Media[];
  total_pages: number;
  total_results: number;
};

async function fetchFromTMDB(endpoint: string): Promise<Media[]> {
  const url = new URL(`${BASE_URL}${endpoint}`);

  if (!url.searchParams.has("api_key")) {
    url.searchParams.set("api_key", API_KEY ?? "");
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    const message = `TMDB request failed: ${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  const data = (await res.json()) as TmdbListResponse;
  return data.results ?? [];
}

// High-level helpers for the most common TMDB queries used by the UI.
// These wrap the lower-level fetchFromTMDB helper and always return JSON data.

export async function fetchTrending(): Promise<Media[]> {
  return fetchFromTMDB("/trending/all/week?language=en-US");
}

export async function fetchTopRated(): Promise<Media[]> {
  return fetchFromTMDB("/movie/top_rated?language=en-US");
}

export async function fetchByGenre(genreId: number): Promise<Media[]> {
  return fetchFromTMDB(
    `/discover/movie?with_genres=${genreId}&language=en-US`,
  );
}


// 🔥 Fetch trailer video (YouTube)
export async function fetchMovieVideo(id: number): Promise<string | null> {
  try {
    const url = new URL(`${BASE_URL}/movie/${id}/videos`);
    url.searchParams.set("api_key", API_KEY ?? "");
    url.searchParams.set("language", "en-US");

    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error(`Video fetch failed: ${res.status}`);
    }

    const data = await res.json();

    // find YouTube trailer
    const trailer = data.results?.find(
      (vid: any) =>
        vid.type === "Trailer" && vid.site === "YouTube"
    );

    return trailer ? trailer.key : null;
  } catch (err) {
    console.error("Video fetch error:", err);
    return null;
  }
}


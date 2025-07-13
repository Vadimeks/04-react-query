// src/services/movieService.ts

import axios from "axios";
import type { Movie } from "../types/movie";

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

interface TmdbApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(query: string): Promise<Movie[]> {
  try {
    const response = await tmdbApi.get<TmdbApiResponse>("/search/movie", {
      params: {
        query: query,
        include_adult: false,
        language: "en-US",
        page: 1,
      },
    });
    return response.data.results;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching movies:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    } else {
      console.error("Unexpected error fetching movies:", error);
    }
    throw new Error("Failed to fetch movies");
  }
}

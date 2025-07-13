import React from "react";
import css from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER_IMAGE =
  "https://placehold.co/500x750/cccccc/333333?text=No+Image";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}
export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <ul className={css.grid}>
      {movies.map((movie) => (
        <li key={movie.id} onClick={() => onSelect(movie)}>
          <div className={css.card}>
            <img
              className={css.image}
              src={
                movie.poster_path
                  ? `${IMAGE_BASE_URL}${movie.poster_path}`
                  : PLACEHOLDER_IMAGE
              }
              alt={movie.title}
              loading="lazy"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = PLACEHOLDER_IMAGE;
              }}
            />
            <h2 className={css.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}

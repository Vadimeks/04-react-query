import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./MovieModal.module.css";
import type { Movie } from "../../types/movie";

const IMAGE_BASE_URL_ORIGINAL = "https://image.tmdb.org/t/p/original";
const PLACEHOLDER_IMAGE_MODAL =
  "https://placehold.co/1280x720/cccccc/333333?text=No+Image+Available";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          // src={
          //   movie.backdrop_path
          //     ? `${IMAGE_BASE_URL_ORIGINAL}${movie.backdrop_path}`
          //     : PLACEHOLDER_IMAGE_MODAL
          // }
          src={
            movie.backdrop_path
              ? `${IMAGE_BASE_URL_ORIGINAL}${movie.backdrop_path}`
              : movie.poster_path
              ? `${IMAGE_BASE_URL_ORIGINAL}${movie.poster_path}`
              : PLACEHOLDER_IMAGE_MODAL
          }
          alt={movie.title}
          className={css.image}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = PLACEHOLDER_IMAGE_MODAL;
          }}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

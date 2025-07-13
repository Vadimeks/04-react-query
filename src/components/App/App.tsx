import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearchSubmit = async (searchQuery: string) => {
    setQuery(searchQuery);
    setMovies([]);
    setIsLoading(true);
    setError(null);
    setSelectedMovie(null);

    try {
      const fetchedMovies = await fetchMovies(searchQuery);
      if (fetchedMovies.length === 0) {
        toast.error("No movies found for your request.");
      }
      setMovies(fetchedMovies);
    } catch (err) {
      setError("Failed to fetch movies. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearchSubmit} />;
      {query && !isLoading && !error && movies.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          Showing results for: "{query}"
        </p>
      )}
      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      {!isLoading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleMovieSelect} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

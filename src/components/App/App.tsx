import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie, MovieApiResponse } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, error } = useQuery<MovieApiResponse, Error>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
  });

  useEffect(() => {
    if (!isLoading && !error && query && data && data.results.length === 0) {
      toast.error(`No movies found for "${query}". Try another search.`, {
        id: "no-movies-found",
      });
    }
    if (error) {
      toast.error("Failed to fetch movies. Please try again.", {
        id: "fetch-error",
      });
    }
  }, [data, isLoading, error, query]);

  const handleSearchSubmit = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
    setSelectedMovie(null);
    if (!searchQuery) {
      toast.error("Please enter a search query.", {
        id: "empty-query",
      });
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
      <SearchBar onSubmit={handleSearchSubmit} />
      {data && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      {!isLoading && !error && data && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={handleMovieSelect} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export interface Movie {
  id: number;
  poster_path: string | null;
  backdrop_path: string | null;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
}
export interface MovieApiResponse {
  results: Movie[];
  total_pages: number;
}

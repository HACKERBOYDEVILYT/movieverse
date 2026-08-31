const API_BASE = "https://api.themoviedb.org/3";

const getApiKey = () => import.meta.env.VITE_TMDB_API_KEY;

async function request(endpoint, params = {}) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error(
      "TMDB API key is missing. Add VITE_TMDB_API_KEY to your .env file."
    );
  }

  const searchParams = new URLSearchParams({
    api_key: apiKey,
    language: "en-US",
    ...params
  });

  const response = await fetch(
    `${API_BASE}${endpoint}?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
}

export const tmdb = {
  trending: (page = 1) =>
    request("/trending/all/week", {
      page
    }),

  popularMovies: (page = 1) =>
    request("/movie/popular", {
      page
    }),

  popularSeries: (page = 1) =>
    request("/tv/popular", {
      page
    }),

  nowPlaying: (page = 1) =>
    request("/movie/now_playing", {
      page
    }),

  upcoming: (page = 1) =>
    request("/movie/upcoming", {
      page
    }),

  topRatedMovies: (page = 1) =>
    request("/movie/top_rated", {
      page
    }),

  topRatedSeries: (page = 1) =>
    request("/tv/top_rated", {
      page
    }),

  searchMulti: (query, page = 1) =>
    request("/search/multi", {
      query,
      page,
      include_adult: false
    }),

  movieDetails: (id) =>
    request(`/movie/${id}`, {
      append_to_response: "credits,videos,similar,recommendations"
    }),

  seriesDetails: (id) =>
    request(`/tv/${id}`, {
      append_to_response: "credits,videos,similar,recommendations"
    }),

  seasonDetails: (seriesId, seasonNumber) =>
    request(`/tv/${seriesId}/season/${seasonNumber}`),

  genresMovies: () => request("/genre/movie/list"),

  genresSeries: () => request("/genre/tv/list")
};

export function imageUrl(path, size = "w500") {
  if (!path) return null;

  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function backdropUrl(path) {
  return imageUrl(path, "original");
}

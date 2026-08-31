import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Info,
  ChevronRight,
  LoaderCircle
} from "lucide-react";

import { tmdb, backdropUrl } from "../../api/tmdb";
import MovieRow from "../../components/movie/MovieRow";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [topMovies, setTopMovies] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadHome() {
      try {
        setLoading(true);
        setError("");

        const [
          trendingData,
          moviesData,
          seriesData,
          topMoviesData
        ] = await Promise.all([
          tmdb.trending(),
          tmdb.popularMovies(),
          tmdb.popularSeries(),
          tmdb.topRatedMovies()
        ]);

        if (!mounted) return;

        setTrending(
          (trendingData.results || []).filter(
            (item) =>
              item.media_type === "movie" ||
              item.media_type === "tv"
          )
        );

        setPopularMovies(
          (moviesData.results || []).map((item) => ({
            ...item,
            media_type: "movie"
          }))
        );

        setPopularSeries(
          (seriesData.results || []).map((item) => ({
            ...item,
            media_type: "tv"
          }))
        );

        setTopMovies(
          (topMoviesData.results || []).map((item) => ({
            ...item,
            media_type: "movie"
          }))
        );
      } catch (err) {
        console.error(err);

        if (mounted) {
          setError(
            err.message ||
              "Unable to load movie data."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadHome();

    return () => {
      mounted = false;
    };
  }, []);

  const hero = trending[0];

  if (loading) {
    return (
      <div className="loading-screen">
        <LoaderCircle className="spin" size={36} />
        <span>Loading MovieVerse...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h1>Unable to load MovieVerse</h1>
        <p>{error}</p>

        <p className="error-help">
          Check your TMDB API key in the <code>.env</code> file
          and restart the development server.
        </p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {hero && (
        <section
          className="hero"
          style={{
            backgroundImage: `linear-gradient(
              90deg,
              rgba(7, 7, 12, 1) 0%,
              rgba(7, 7, 12, 0.88) 35%,
              rgba(7, 7, 12, 0.35) 70%,
              rgba(7, 7, 12, 0.85) 100%
            ), url(${backdropUrl(hero.backdrop_path)})`
          }}
        >
          <div className="hero-content">
            <span className="hero-badge">
              TRENDING THIS WEEK
            </span>

            <h1>
              {hero.title || hero.name}
            </h1>

            <div className="hero-meta">
              <span>
                {(
                  hero.release_date ||
                  hero.first_air_date ||
                  ""
                ).slice(0, 4)}
              </span>

              <span>•</span>

              <span>
                ⭐ {Number(hero.vote_average || 0).toFixed(1)}
              </span>

              <span>•</span>

              <span>
                {hero.media_type === "tv"
                  ? "Series"
                  : "Movie"}
              </span>
            </div>

            <p>
              {hero.overview ||
                "Discover this trending title on MovieVerse."}
            </p>

            <div className="hero-actions">
              <Link
                to={`/details/${
                  hero.media_type === "tv"
                    ? "tv"
                    : "movie"
                }-${hero.id}`}
                className="primary-button"
              >
                <Play size={18} fill="currentColor" />
                Watch Now
              </Link>

              <Link
                to={`/details/${
                  hero.media_type === "tv"
                    ? "tv"
                    : "movie"
                }-${hero.id}`}
                className="secondary-button"
              >
                <Info size={18} />
                Details
              </Link>
            </div>
          </div>

          <div className="hero-fade" />
        </section>
      )}

      <div className="home-content">
        <MovieRow
          title="Trending Now"
          items={trending}
        />

        <MovieRow
          title="Popular Movies"
          items={popularMovies}
          viewAll="/movies"
        />

        <MovieRow
          title="Popular Series"
          items={popularSeries}
          viewAll="/series"
        />

        <MovieRow
          title="Top Rated Movies"
          items={topMovies}
          viewAll="/movies"
        />
      </div>
    </div>
  );
}

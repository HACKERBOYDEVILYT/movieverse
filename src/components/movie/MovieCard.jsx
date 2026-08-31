import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { imageUrl } from "../../api/tmdb";

export default function MovieCard({ item }) {
  const isMovie = item.media_type === "movie" || item.title;

  const title = item.title || item.name || "Untitled";

  const year = (
    item.release_date ||
    item.first_air_date ||
    ""
  ).slice(0, 4);

  const type = isMovie ? "movie" : "tv";

  return (
    <Link to={`/details/${type}-${item.id}`} className="movie-card">
      <div className="movie-poster">
        {item.poster_path ? (
          <img
            src={imageUrl(item.poster_path, "w500")}
            alt={title}
            loading="lazy"
          />
        ) : (
          <div className="poster-fallback">No Image</div>
        )}

        <div className="movie-rating">
          <Star size={13} fill="currentColor" />
          {Number(item.vote_average || 0).toFixed(1)}
        </div>

        <div className="movie-type">
          {isMovie ? "Movie" : "Series"}
        </div>
      </div>

      <div className="movie-info">
        <h3>{title}</h3>

        <span>
          {year || "N/A"}
        </span>
      </div>
    </Link>
  );
}

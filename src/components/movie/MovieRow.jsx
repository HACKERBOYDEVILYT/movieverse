import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import { ChevronRight } from "lucide-react";

export default function MovieRow({
  title,
  items = [],
  viewAll = "#"
}) {
  if (!items.length) return null;

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
        </div>

        {viewAll !== "#" && (
          <Link to={viewAll} className="view-all">
            View all
            <ChevronRight size={16} />
          </Link>
        )}
      </div>

      <div className="movie-grid">
        {items.slice(0, 10).map((item) => (
          <MovieCard
            key={`${item.media_type || "item"}-${item.id}`}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}

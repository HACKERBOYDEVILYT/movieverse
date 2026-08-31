import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <Link to="/" className="brand footer-brand">
            <span className="brand-mark">M</span>

            <span className="brand-text">
              Movie<span>Verse</span>
            </span>
          </Link>

          <p className="footer-description">
            Discover movies and series in one beautiful place.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/movies">Movies</Link>
          <Link to="/series">Series</Link>
          <Link to="/search">Search</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} MovieVerse. All rights reserved.
        </span>

        <span className="made-with">
          Made with <Heart size={14} fill="currentColor" />
        </span>
      </div>
    </footer>
  );
}

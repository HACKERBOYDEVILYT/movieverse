import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  UserRound,
  Heart,
  History,
  Film,
  Tv
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) return;

    navigate(`/search?q=${encodeURIComponent(value)}`);
    setMobileOpen(false);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Movies", path: "/movies", icon: Film },
    { label: "Series", path: "/series", icon: Tv }
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">M</span>

          <span className="brand-text">
            Movie<span>Verse</span>
          </span>
        </Link>

        <nav className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                {Icon && <Icon size={17} />}
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <form className="search-box" onSubmit={submitSearch}>
          <Search size={18} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies & series..."
            aria-label="Search movies and series"
          />
        </form>

        <div className="nav-actions">
          <Link
            to="/profile"
            className="icon-button"
            title="Profile"
            aria-label="Profile"
          >
            <UserRound size={19} />
          </Link>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          <form className="mobile-search" onSubmit={submitSearch}>
            <Search size={18} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
          </form>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? "active" : ""}`
                }
              >
                {Icon && <Icon size={18} />}
                {item.label}
              </NavLink>
            );
          })}

          <Link
            to="/profile"
            onClick={() => setMobileOpen(false)}
            className="mobile-nav-link"
          >
            <UserRound size={18} />
            Profile
          </Link>

          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="mobile-login-button"
          >
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
}

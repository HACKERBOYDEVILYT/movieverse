import { Navigate, Outlet, Route, Routes, NavLink, Link } from "react-router-dom";

/* =========================
   USER LAYOUT
========================= */

function UserLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-icon">▶</span>
            <span>
              Movie<span>Verse</span>
            </span>
          </Link>

          <nav className="main-nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/movies">Movies</NavLink>
            <NavLink to="/series">Series</NavLink>
            <NavLink to="/trending">Trending</NavLink>
          </nav>

          <div className="header-actions">
            <Link to="/search" className="search-button">
              <span>⌕</span>
              <span className="search-label">Search</span>
            </Link>

            <Link to="/watchlist" className="icon-button">
              ♡
            </Link>

            <Link to="/profile" className="avatar">
              U
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

/* =========================
   HOME
========================= */

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="live-dot" />
            STREAM ANYTIME
          </div>

          <h1>
            Unlimited movies.
            <br />
            Endless stories.
          </h1>

          <p>
            Discover thousands of movies and series,
            organized beautifully in one place.
          </p>

          <div className="hero-actions">
            <Link to="/movies" className="btn btn-primary">
              Explore Movies
            </Link>

            <Link to="/trending" className="btn btn-secondary">
              View Trending
            </Link>
          </div>
        </div>
      </section>

      <section className="content-section">
        <SectionHeader title="Trending Now" action="View all" />

        <MovieRow />
      </section>

      <section className="content-section">
        <SectionHeader title="Popular Movies" action="View all" />

        <MovieRow />
      </section>

      <section className="content-section">
        <SectionHeader title="Featured Series" action="View all" />

        <MovieRow />
      </section>
    </>
  );
}

/* =========================
   MOVIE CARD
========================= */

function MovieCard({ title = "Featured Title", type = "Movie" }) {
  return (
    <Link to="/details/demo" className="movie-card">
      <div className="poster">
        <div className="poster-gradient">
          <span>{type}</span>
        </div>

        <div className="poster-play">▶</div>
      </div>

      <div className="movie-info">
        <h3>{title}</h3>

        <div className="movie-meta">
          <span>2026</span>
          <span>•</span>
          <span>HD</span>
        </div>
      </div>
    </Link>
  );
}

function MovieRow() {
  return (
    <div className="movie-grid">
      <MovieCard title="The Last Horizon" />
      <MovieCard title="Dark Kingdom" />
      <MovieCard title="Beyond Time" />
      <MovieCard title="Silent City" />
      <MovieCard title="Final Chapter" />
    </div>
  );
}

/* =========================
   SECTION HEADER
========================= */

function SectionHeader({ title, action }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        <p>Curated for you</p>
      </div>

      <Link to="/movies" className="view-all">
        {action} →
      </Link>
    </div>
  );
}

/* =========================
   CATALOG
========================= */

function Catalog({ title, subtitle }) {
  return (
    <section className="catalog-page">
      <div className="page-container">
        <div className="page-heading">
          <span className="eyebrow">MOVIEVERSE</span>

          <h1>{title}</h1>

          <p>{subtitle}</p>
        </div>

        <div className="filter-bar">
          <button className="filter active">All</button>
          <button className="filter">Action</button>
          <button className="filter">Drama</button>
          <button className="filter">Comedy</button>
          <button className="filter">Thriller</button>
          <button className="filter">Sci-Fi</button>
        </div>

        <div className="catalog-grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <MovieCard
              key={index}
              title={`Movie Title ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================
   SEARCH
========================= */

function Search() {
  return (
    <section className="catalog-page">
      <div className="page-container">
        <div className="search-page">
          <span className="eyebrow">DISCOVER</span>

          <h1>Search MovieVerse</h1>

          <p>
            Find your next movie or series.
          </p>

          <div className="large-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search movies, series, actors..."
            />
          </div>
        </div>

        <div className="section-header">
          <div>
            <h2>Popular Searches</h2>
          </div>
        </div>

        <div className="catalog-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <MovieCard
              key={index}
              title={`Popular Result ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================
   DETAILS
========================= */

function Details() {
  return (
    <section className="details-page">
      <div className="details-backdrop" />

      <div className="page-container details-container">
        <div className="details-poster">
          <div className="poster-gradient large">
            MOVIE
          </div>
        </div>

        <div className="details-content">
          <span className="eyebrow">FEATURED MOVIE</span>

          <h1>The Last Horizon</h1>

          <div className="details-meta">
            <span>2026</span>
            <span>•</span>
            <span>2h 14m</span>
            <span>•</span>
            <span>HD</span>
          </div>

          <p>
            A cinematic journey through an unknown world
            where every decision changes the future.
          </p>

          <div className="details-actions">
            <Link to="/watch/demo" className="btn btn-primary">
              ▶ Watch Now
            </Link>

            <button className="btn btn-secondary">
              ♡ Add to Watchlist
            </button>
          </div>

          <div className="details-tags">
            <span>Action</span>
            <span>Adventure</span>
            <span>Sci-Fi</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================
   WATCH
========================= */

function Watch() {
  return (
    <section className="watch-page">
      <div className="page-container">
        <div className="player">
          <div className="player-message">
            <div className="player-icon">▶</div>
            <h2>Ready to Watch</h2>
            <p>Select a server below to start playback.</p>
          </div>
        </div>

        <div className="watch-toolbar">
          <div>
            <h2>The Last Horizon</h2>
            <p>Choose a playback server</p>
          </div>
        </div>

        <div className="server-grid">
          <button className="server active">
            <strong>Server 01</strong>
            <span>Primary • Fast</span>
          </button>

          <button className="server">
            <strong>Server 02</strong>
            <span>Backup • HD</span>
          </button>

          <button className="server">
            <strong>Server 03</strong>
            <span>Backup • Auto</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================
   AUTH
========================= */

function Login() {
  return <AuthForm title="Welcome back" button="Sign In" />;
}

function Register() {
  return <AuthForm title="Create your account" button="Create Account" register />;
}

function AuthForm({ title, button, register }) {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">▶</div>

        <h1>{title}</h1>

        <p>
          {register
            ? "Join MovieVerse and start watching."
            : "Sign in to continue to MovieVerse."}
        </p>

        {register && (
          <label>
            Name
            <input placeholder="Your name" />
          </label>
        )}

        <label>
          Email
          <input type="email" placeholder="you@example.com" />
        </label>

        <label>
          Password
          <input type="password" placeholder="••••••••" />
        </label>

        <button className="btn btn-primary auth-submit">
          {button}
        </button>

        <div className="auth-switch">
          {register ? (
            <>
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link to="/register">Create one</Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================
   USER PAGES
========================= */

function SimplePage({ title, description }) {
  return (
    <section className="catalog-page">
      <div className="page-container">
        <div className="page-heading">
          <span className="eyebrow">MOVIEVERSE</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="empty-state">
          <div className="empty-icon">✦</div>
          <h2>Nothing here yet</h2>
          <p>Your content will appear here.</p>
        </div>
      </div>
    </section>
  );
}

/* =========================
   ADMIN
========================= */

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">
          <span>▶</span>
          <strong>MovieVerse</strong>
        </Link>

        <div className="admin-label">MAIN</div>

        <AdminLink to="/admin" icon="▦" text="Dashboard" />

        <div className="admin-label">CONTENT</div>

        <AdminLink to="/admin/movies" icon="◈" text="Movies" />
        <AdminLink to="/admin/series" icon="▣" text="Series" />
        <AdminLink to="/admin/episodes" icon="▶" text="Episodes" />
        <AdminLink to="/admin/featured" icon="★" text="Featured" />
        <AdminLink to="/admin/trending" icon="↗" text="Trending" />

        <div className="admin-label">SYSTEM</div>

        <AdminLink
          to="/admin/providers"
          icon="⌘"
          text="API Providers"
        />

        <AdminLink
          to="/admin/servers"
          icon="◉"
          text="Video Servers"
        />

        <AdminLink
          to="/admin/users"
          icon="♙"
          text="Users"
        />

        <AdminLink
          to="/admin/settings"
          icon="⚙"
          text="Settings"
        />

        <div className="admin-sidebar-bottom">
          <Link to="/" className="admin-site-link">
            ← View Website
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div>
            <strong>Administration</strong>
            <span>Manage your MovieVerse platform</span>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <span>System Admin</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminLink({ to, icon, text }) {
  return (
    <NavLink
      to={to}
      end={to === "/admin"}
      className="admin-link"
    >
      <span className="admin-link-icon">{icon}</span>
      <span>{text}</span>
    </NavLink>
  );
}

function AdminDashboard() {
  const stats = [
    ["Total Movies", "0", "Movies in catalog"],
    ["Total Series", "0", "Series available"],
    ["API Providers", "0", "Connected providers"],
    ["Video Servers", "0", "Playback servers"],
  ];

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>Monitor and manage your platform.</p>
        </div>

        <button className="btn btn-primary">
          + Add Content
        </button>
      </div>

      <div className="admin-stats">
        {stats.map(([label, value, desc]) => (
          <div className="stat-card" key={label}>
            <div className="stat-top">
              <span>{label}</span>
              <span className="stat-icon">✦</span>
            </div>

            <strong>{value}</strong>
            <small>{desc}</small>
          </div>
        ))}
      </div>

      <div className="admin-columns">
        <div className="admin-panel">
          <div className="panel-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Common administration tasks</p>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/admin/movies">Add Movie</Link>
            <Link to="/admin/series">Add Series</Link>
            <Link to="/admin/providers">Add API Provider</Link>
            <Link to="/admin/servers">Add Video Server</Link>
          </div>
        </div>

        <div className="admin-panel">
          <div className="panel-heading">
            <div>
              <h2>System Status</h2>
              <p>Current platform health</p>
            </div>
          </div>

          <div className="status-list">
            <div>
              <span>Frontend</span>
              <strong className="status-ok">Operational</strong>
            </div>

            <div>
              <span>API Engine</span>
              <strong className="status-ok">Ready</strong>
            </div>

            <div>
              <span>Video Engine</span>
              <strong className="status-ok">Ready</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AdminSection({ title, description }) {
  return (
    <div className="admin-page-heading">
      <div>
        <span className="eyebrow">ADMINISTRATION</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

/* =========================
   ROUTES
========================= */

export default function AppRoutes() {
  return (
    <Routes>
      {/* USER */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/movies"
          element={
            <Catalog
              title="Movies"
              subtitle="Explore the latest and greatest movies."
            />
          }
        />

        <Route
          path="/series"
          element={
            <Catalog
              title="Series"
              subtitle="Discover your next favorite series."
            />
          }
        />

        <Route
          path="/trending"
          element={
            <Catalog
              title="Trending"
              subtitle="What's popular right now."
            />
          }
        />

        <Route path="/search" element={<Search />} />

        <Route path="/details/:id" element={<Details />} />

        <Route path="/watch/:id" element={<Watch />} />

        <Route
          path="/watchlist"
          element={
            <SimplePage
              title="My Watchlist"
              description="Save movies and series to watch later."
            />
          }
        />

        <Route
          path="/history"
          element={
            <SimplePage
              title="Watch History"
              description="Continue watching your recently viewed content."
            />
          }
        />

        <Route
          path="/profile"
          element={
            <SimplePage
              title="Your Profile"
              description="Manage your MovieVerse account."
            />
          }
        />
      </Route>

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ADMIN */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="/admin/movies"
          element={
            <AdminSection
              title="Movie Management"
              description="Add, edit and manage your movie catalog."
            />
          }
        />

        <Route
          path="/admin/series"
          element={
            <AdminSection
              title="Series Management"
              description="Manage series and seasons."
            />
          }
        />

        <Route
          path="/admin/episodes"
          element={
            <AdminSection
              title="Episode Management"
              description="Manage episodes and playback sources."
            />
          }
        />

        <Route
          path="/admin/featured"
          element={
            <AdminSection
              title="Featured Content"
              description="Control content displayed in featured sections."
            />
          }
        />

        <Route
          path="/admin/trending"
          element={
            <AdminSection
              title="Trending Content"
              description="Manage trending movies and series."
            />
          }
        />

        <Route
          path="/admin/providers"
          element={
            <AdminSection
              title="API Providers"
              description="Manage unlimited metadata/API providers, priorities and fallback routing."
            />
          }
        />

        <Route
          path="/admin/servers"
          element={
            <AdminSection
              title="Video Servers"
              description="Manage playback servers and manual embed sources."
            />
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminSection
              title="User Management"
              description="Manage registered users and platform activity."
            />
          }
        />

        <Route
          path="/admin/settings"
          element={
            <AdminSection
              title="System Settings"
              description="Configure MovieVerse platform settings."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

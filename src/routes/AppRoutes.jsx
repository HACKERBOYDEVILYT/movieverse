import { Routes, Route } from "react-router-dom";

// Public pages
import Home from "../pages/Home";
import Search from "../pages/Search";
import AnimeDetails from "../pages/AnimeDetails";
import Watch from "../pages/Watch";
import Trending from "../pages/Trending";
import Popular from "../pages/Popular";
import Seasonal from "../pages/Seasonal";
import Genre from "../pages/Genre";
import Watchlist from "../pages/Watchlist";
import History from "../pages/History";
import Profile from "../pages/Profile";

// Authentication
import Login from "../pages/Login";
import Register from "../pages/Register";

// 404
import NotFound from "../pages/NotFound";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";

import {
  AdminAnime,
  AdminEpisodes,
  AdminFeatured,
  AdminUsers,
  AdminAnalytics,
  AdminSettings,
} from "../pages/admin/AdminManagement";

import ApiProviders from "../pages/admin/ApiProviders";

function AppRoutes() {
  return (
    <Routes>
      {/* =========================================
          PUBLIC
      ========================================= */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/search"
        element={<Search />}
      />

      <Route
        path="/anime/:id"
        element={<AnimeDetails />}
      />

      <Route
        path="/watch/:animeId/:episode"
        element={<Watch />}
      />

      <Route
        path="/trending"
        element={<Trending />}
      />

      <Route
        path="/popular"
        element={<Popular />}
      />

      <Route
        path="/seasonal"
        element={<Seasonal />}
      />

      <Route
        path="/genre/:genre"
        element={<Genre />}
      />

      <Route
        path="/watchlist"
        element={<Watchlist />}
      />

      <Route
        path="/history"
        element={<History />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

      {/* =========================================
          AUTHENTICATION
      ========================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* =========================================
          ADMIN
      ========================================= */}

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/anime"
        element={<AdminAnime />}
      />

      <Route
        path="/admin/episodes"
        element={<AdminEpisodes />}
      />

      <Route
        path="/admin/featured"
        element={<AdminFeatured />}
      />

      <Route
        path="/admin/providers"
        element={<ApiProviders />}
      />

      <Route
        path="/admin/users"
        element={<AdminUsers />}
      />

      <Route
        path="/admin/analytics"
        element={<AdminAnalytics />}
      />

      <Route
        path="/admin/settings"
        element={<AdminSettings />}
      />

      {/* =========================================
          404
      ========================================= */}

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default AppRoutes;

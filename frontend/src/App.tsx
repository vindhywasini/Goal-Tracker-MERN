import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Todos from "./pages/Todos";
import { useAuthStore } from "./store";

type Theme = "light" | "dark";

export default function App() {
  const { user, logout } = useAuthStore();
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (window.localStorage.getItem("theme") as Theme) || "light";
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("dark-mode", theme === "dark");
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div id="app-container">
      <header>
        <h1>TrackToSuccess</h1>

        <div className="theme-toggle">
          <button id="toggle-theme" onClick={toggleTheme}>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>

        <nav className="top-nav">
          {user ? (
            <>
              <span className="user-chip">
                {user.name || user.email}
              </span>
              <button className="nav-btn" onClick={logout}>
                Logout
              </button>
              {/* <Link className="nav-link" to="/todos">
                My Goals
              </Link> */}
            </>
          ) : (
            <>
              <Link className="nav-link" to="/signin">
                Sign in
              </Link>
              <Link className="nav-link" to="/signup">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? "/todos" : "/signin"} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/todos"
            element={user ? <Todos /> : <Navigate to="/signin" />}
          />
        </Routes>
      </main>

      <footer>
        <p>&copy; 2025 TrackToSuccess. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

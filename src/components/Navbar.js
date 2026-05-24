import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  const initials = user ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "";

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          HireNest<span>.</span>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link to="/jobs" className={isActive("/jobs")} onClick={() => setMenuOpen(false)}>Browse Jobs</Link>

          {user ? (
            <>
              <Link
                to={user.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard"}
                className={isActive(user.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard")}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              {user.role === "candidate" && (
                <Link to="/candidate/applications" className={isActive("/candidate/applications")} onClick={() => setMenuOpen(false)}>
                  My Applications
                </Link>
              )}
              {user.role === "employer" && (
                <Link to="/employer/post-job" className={isActive("/employer/post-job")} onClick={() => setMenuOpen(false)}>
                  Post a Job
                </Link>
              )}
              <div className="nav-user">
                <div className="nav-avatar">{initials}</div>
                <span className="nav-user-name">{user.name.split(" ")[0]}</span>
                <button className="nav-btn outline btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn outline" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/signup" className="nav-btn" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

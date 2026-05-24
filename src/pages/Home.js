import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getJobs } from "../utils/storage";
import JobCard from "../components/JobCard";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => { setJobs(getJobs()); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(search)}`);
  };

  const featured = jobs.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-orb hero-bg-orb-1" />
        <div className="hero-bg-orb hero-bg-orb-2" />
        <div className="hero-graphic">{'{ }'}</div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-label">🚀 Launching careers since 2024</div>
          <h1 className="hero-title">
            Find Work That<br />
            <span className="highlight">Actually Excites You</span>
          </h1>
          <p className="hero-sub">
            HireNest connects ambitious professionals with companies building things that matter. No noise, just opportunity.
          </p>

          <form onSubmit={handleSearch} className="hero-actions">
            <div className="search-bar">
              <input
                className="search-input"
                placeholder="Job title, skill, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="search-divider" />
              <button type="submit" className="btn btn-primary" style={{ margin: 0, borderRadius: "50px" }}>
                Search Jobs
              </button>
            </div>
          </form>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-num">{jobs.length}+</div>
              <div className="hero-stat-label">Open Positions</div>
            </div>
            <div>
              <div className="hero-stat-num">50+</div>
              <div className="hero-stat-label">Companies</div>
            </div>
            <div>
              <div className="hero-stat-num">10K+</div>
              <div className="hero-stat-label">Candidates Placed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "60px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: "20px" }}>
            <div>
              <div className="section-title">Browse by Category</div>
              <div className="section-subtitle">Explore opportunities in your domain</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[
              { icon: "⚛️", label: "Frontend" }, { icon: "⚙️", label: "Backend" },
              { icon: "🎨", label: "Design" }, { icon: "📊", label: "Data Science" },
              { icon: "☁️", label: "DevOps" }, { icon: "📱", label: "Mobile" },
              { icon: "🛒", label: "Product" }, { icon: "🔐", label: "Security" },
            ].map((c) => (
              <Link key={c.label} to={`/jobs?search=${c.label}`}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 20px", borderRadius: "50px",
                  background: "var(--card)", border: "1px solid var(--border)",
                  color: "var(--text2)", fontSize: "0.875rem", fontWeight: "500",
                  transition: "all 0.2s", textDecoration: "none"
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)"; }}
              >
                {c.icon} {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-title">Featured Opportunities</div>
              <div className="section-subtitle">Hand-picked roles from top companies</div>
            </div>
            <Link to="/jobs" className="btn btn-secondary btn-sm">View All Jobs →</Link>
          </div>
          {featured.length > 0 ? (
            <div className="jobs-grid">
              {featured.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🏢</div>
              <div className="empty-state-title">No jobs posted yet</div>
              <div className="empty-state-sub">Be the first to post a job opportunity!</div>
            </div>
          )}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div style={{
            background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,107,107,0.1))",
            border: "1px solid rgba(108,99,255,0.3)", borderRadius: "20px",
            padding: "60px 48px", textAlign: "center"
          }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem,4vw,2.5rem)", fontWeight: 800, marginBottom: "12px" }}>
              Ready to hire top talent?
            </div>
            <p style={{ color: "var(--text2)", marginBottom: "28px", fontSize: "1rem" }}>
              Post your job listing in minutes and reach thousands of qualified candidates.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/signup" className="btn btn-primary">Post a Job Free</Link>
              <Link to="/jobs" className="btn btn-secondary">Browse Candidates</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

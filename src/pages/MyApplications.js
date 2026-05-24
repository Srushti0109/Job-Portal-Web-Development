import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getApplicationsByCandidate, getJobById } from "../utils/storage";
import { useAuth } from "../context/AuthContext";

const STATUS_COLORS = {
  Applied: "badge-status", Reviewed: "badge-status", Shortlisted: "badge-applied",
  Rejected: "badge-rejected", "Offer Extended": "badge-applied",
};

export default function MyApplications() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const data = getApplicationsByCandidate(user.id)
      .map(app => ({ ...app, job: getJobById(app.jobId) }))
      .filter(a => a.job)
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    setApps(data);
  }, [user]);

  const statuses = ["All", "Applied", "Reviewed", "Shortlisted", "Offer Extended", "Rejected"];
  const filtered = filter === "All" ? apps : apps.filter(a => a.status === filter);

  return (
    <div className="page">
      <div className="container">
        <div className="section-header">
          <div>
            <h1 className="section-title">My Applications</h1>
            <div className="section-subtitle">{apps.length} application{apps.length !== 1 ? "s" : ""} total</div>
          </div>
          <Link to="/jobs" className="btn btn-primary btn-sm">+ Find More Jobs</Link>
        </div>

        <div className="tabs">
          {statuses.map(s => (
            <button key={s} className={`tab ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
              {s} {s === "All" ? `(${apps.length})` : `(${apps.filter(a => a.status === s).length})`}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filtered.map(a => (
              <div key={a.id} className="card" style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                  background: `linear-gradient(135deg, #6c63ff, #ff6b6b)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-heading)", fontWeight: 700, color: "white", fontSize: "1.1rem"
                }}>
                  {a.job.company[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                    <div>
                      <Link to={`/jobs/${a.job.id}`} style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.05rem", color: "var(--text)" }}>
                        {a.job.title}
                      </Link>
                      <div style={{ color: "var(--text2)", fontSize: "0.875rem", marginTop: "2px" }}>
                        {a.job.company} · {a.job.location} · {a.job.type}
                      </div>
                    </div>
                    <span className={`badge ${STATUS_COLORS[a.status] || "badge-status"}`}>{a.status}</span>
                  </div>
                  {a.coverLetter && (
                    <div style={{
                      marginTop: "12px", padding: "12px 16px", borderRadius: "8px",
                      background: "var(--bg3)", border: "1px solid var(--border)",
                      fontSize: "0.85rem", color: "var(--text2)", lineHeight: 1.6
                    }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Your Cover Letter</div>
                      {a.coverLetter}
                    </div>
                  )}
                  <div style={{ marginTop: "10px", fontSize: "0.78rem", color: "var(--text3)" }}>
                    Applied on {new Date(a.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">No applications {filter !== "All" ? `with status "${filter}"` : "yet"}</div>
            <div className="empty-state-sub" style={{ marginBottom: "20px" }}>
              {filter !== "All" ? "Try a different filter" : "Start applying to jobs to track them here"}
            </div>
            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
          </div>
        )}
      </div>
    </div>
  );
}

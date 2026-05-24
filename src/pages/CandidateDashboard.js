import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getApplicationsByCandidate, getJobById, getJobs } from "../utils/storage";
import { useAuth } from "../context/AuthContext";
import JobCard from "../components/JobCard";

const STATUS_COLORS = {
  Applied: "badge-status", Reviewed: "badge-status", Shortlisted: "badge-applied",
  Rejected: "badge-rejected", "Offer Extended": "badge-applied",
};

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const myApps = getApplicationsByCandidate(user.id).map(app => ({
      ...app, job: getJobById(app.jobId)
    })).filter(a => a.job);
    setApps(myApps);
    setRecentJobs(getJobs().slice(0, 3));
  }, [user]);

  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-avatar">{initials}</div>
          <div>
            <div className="dashboard-greeting">Good to see you,</div>
            <div className="dashboard-name">{user.name}</div>
            <div className="dashboard-role candidate">🎓 Candidate</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Link to="/jobs" className="btn btn-primary">Browse Jobs →</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-num">{apps.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-num">{apps.filter(a => a.status === "Applied" || a.status === "Reviewed").length}</div>
            <div className="stat-label">Under Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-num">{apps.filter(a => a.status === "Shortlisted" || a.status === "Offer Extended").length}</div>
            <div className="stat-label">Shortlisted</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-num">{apps.filter(a => a.status === "Offer Extended").length}</div>
            <div className="stat-label">Offers Received</div>
          </div>
        </div>

        {/* Recent Applications */}
        <div style={{ marginBottom: "40px" }}>
          <div className="section-header">
            <div className="section-title">Recent Applications</div>
            <Link to="/candidate/applications" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {apps.length > 0 ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Job Title</th><th>Company</th><th>Location</th><th>Applied</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.slice(0, 5).map(a => (
                    <tr key={a.id}>
                      <td><Link to={`/jobs/${a.job.id}`} style={{ color: "var(--accent)", fontWeight: 600 }}>{a.job.title}</Link></td>
                      <td>{a.job.company}</td>
                      <td>{a.job.location}</td>
                      <td>{new Date(a.appliedAt).toLocaleDateString("en-IN")}</td>
                      <td><span className={`badge ${STATUS_COLORS[a.status] || "badge-status"}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "48px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📭</div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "8px" }}>No applications yet</div>
              <div style={{ color: "var(--text2)", marginBottom: "20px", fontSize: "0.9rem" }}>Start exploring jobs and apply to your dream roles!</div>
              <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
            </div>
          )}
        </div>

        {/* Recommended Jobs */}
        <div>
          <div className="section-header">
            <div className="section-title">Jobs You Might Like</div>
            <Link to="/jobs" className="btn btn-secondary btn-sm">See All</Link>
          </div>
          <div className="jobs-grid">
            {recentJobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getJobs, deleteJob, getApplicationsByJob, getUsers } from "../utils/storage";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadJobs = () => {
    const all = getJobs().filter(j => j.employerId === user.id);
    const withCounts = all.map(j => ({
      ...j, applicantCount: getApplicationsByJob(j.id).length
    }));
    setJobs(withCounts);
  };

  useEffect(() => { loadJobs(); }, [user]);

  const handleDelete = (jobId) => {
    deleteJob(jobId);
    setConfirmDelete(null);
    addToast("Job deleted successfully.", "success");
    loadJobs();
  };

  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicantCount, 0);
  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-avatar">{initials}</div>
          <div>
            <div className="dashboard-greeting">Employer Dashboard</div>
            <div className="dashboard-name">{user.name}</div>
            {user.company && <div style={{ color: "var(--text3)", fontSize: "0.85rem", marginTop: "2px" }}>🏢 {user.company}</div>}
            <div className="dashboard-role employer">💼 Employer</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Link to="/employer/post-job" className="btn btn-primary">+ Post New Job</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-num">{jobs.length}</div>
            <div className="stat-label">Active Listings</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-num">{totalApplicants}</div>
            <div className="stat-label">Total Applicants</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-num">{jobs.filter(j => j.applicantCount > 0).length}</div>
            <div className="stat-label">Jobs with Applicants</div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="section-header">
          <div className="section-title">Your Job Listings</div>
          <Link to="/employer/post-job" className="btn btn-primary btn-sm">+ Post Job</Link>
        </div>

        {jobs.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job Title</th><th>Location</th><th>Type</th><th>Posted</th>
                  <th>Applicants</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <Link to={`/jobs/${job.id}`} style={{ color: "var(--accent)", fontWeight: 600 }}>{job.title}</Link>
                    </td>
                    <td>{job.location}</td>
                    <td><span className="badge badge-type" style={{ fontSize: "0.72rem" }}>{job.type}</span></td>
                    <td>{new Date(job.postedAt).toLocaleDateString("en-IN")}</td>
                    <td>
                      <Link to={`/employer/applicants/${job.id}`}
                        style={{ color: job.applicantCount > 0 ? "var(--accent3)" : "var(--text3)", fontWeight: 600 }}>
                        {job.applicantCount} {job.applicantCount === 1 ? "applicant" : "applicants"}
                      </Link>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/employer/edit-job/${job.id}`)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(job.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "60px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📝</div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "8px" }}>No jobs posted yet</div>
            <div style={{ color: "var(--text2)", marginBottom: "20px", fontSize: "0.9rem" }}>Post your first job listing and start receiving applications!</div>
            <Link to="/employer/post-job" className="btn btn-primary">Post a Job</Link>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Delete this job?</div>
            <div className="modal-sub">This will permanently remove the listing and all associated applications. This action cannot be undone.</div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

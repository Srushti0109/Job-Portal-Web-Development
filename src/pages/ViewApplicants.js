import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getJobById, getApplicationsByJob, getUsers, updateApplicationStatus } from "../utils/storage";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const STATUSES = ["Applied", "Reviewed", "Shortlisted", "Offer Extended", "Rejected"];
const STATUS_COLORS = {
  Applied: "badge-status", Reviewed: "badge-status", Shortlisted: "badge-applied",
  Rejected: "badge-rejected", "Offer Extended": "badge-applied",
};

export default function ViewApplicants() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  const load = () => {
    const j = getJobById(jobId);
    if (!j || j.employerId !== user.id) { navigate("/employer/dashboard"); return; }
    setJob(j);
    const users = getUsers();
    const apps = getApplicationsByJob(jobId).map(app => ({
      ...app,
      candidate: users.find(u => u.id === app.candidateId) || null
    })).filter(a => a.candidate);
    setApplicants(apps);
  };

  useEffect(() => { load(); }, [jobId, user]);

  const handleStatusChange = (appId, status) => {
    updateApplicationStatus(appId, status);
    load();
    addToast(`Status updated to "${status}"`, "success");
  };

  return (
    <div className="page">
      <div className="container">
        <Link to="/employer/dashboard" className="back-link">← Back to Dashboard</Link>

        {job && (
          <>
            <div className="section-header">
              <div>
                <h1 className="section-title">Applicants for: {job.title}</h1>
                <div className="section-subtitle">
                  {job.company} · {job.location} · {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
                </div>
              </div>
              <Link to={`/employer/edit-job/${job.id}`} className="btn btn-secondary btn-sm">Edit Job</Link>
            </div>

            {applicants.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {applicants.map(a => (
                  <div key={a.id} className="card">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-heading)", fontWeight: 700, color: "white"
                      }}>
                        {a.candidate.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "4px" }}>
                          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1rem" }}>
                            {a.candidate.name}
                          </div>
                          <span className={`badge ${STATUS_COLORS[a.status] || "badge-status"}`}>{a.status}</span>
                        </div>
                        <div style={{ color: "var(--text2)", fontSize: "0.85rem", marginBottom: "8px" }}>
                          ✉️ {a.candidate.email}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text3)", marginBottom: a.coverLetter ? "12px" : 0 }}>
                          Applied {new Date(a.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                        {a.coverLetter && (
                          <div style={{
                            padding: "12px 16px", borderRadius: "8px",
                            background: "var(--bg3)", border: "1px solid var(--border)",
                            fontSize: "0.85rem", color: "var(--text2)", lineHeight: 1.7,
                            marginBottom: "12px"
                          }}>
                            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Cover Letter</div>
                            {a.coverLetter}
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.8rem", color: "var(--text3)" }}>Update Status:</span>
                          <select
                            className="status-select"
                            value={a.status}
                            onChange={(e) => handleStatusChange(a.id, e.target.value)}
                          >
                            {STATUSES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <div className="empty-state-title">No applicants yet</div>
                <div className="empty-state-sub">Share your job listing to attract candidates</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJobById, applyForJob, getApplicationsByCandidate } from "../utils/storage";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();

  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const j = getJobById(id);
    if (!j) { navigate("/jobs"); return; }
    setJob(j);
    if (user?.role === "candidate") {
      const apps = getApplicationsByCandidate(user.id);
      setApplied(apps.some(a => a.jobId === id));
    }
  }, [id, user, navigate]);

  const handleApply = () => {
    if (!user) { navigate("/login"); return; }
    if (user.role === "employer") { addToast("Employers cannot apply for jobs.", "error"); return; }
    setShowModal(true);
  };

  const submitApplication = () => {
    setApplying(true);
    setTimeout(() => {
      const { app, error } = applyForJob(id, user.id, coverLetter);
      if (error) { addToast(error, "error"); }
      else { setApplied(true); addToast("Application submitted successfully! 🎉", "success"); setShowModal(false); }
      setApplying(false);
    }, 500);
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  if (authLoading || !job) return <div className="loader"><div className="spinner" /></div>;

  const [c1, c2] = [["#6c63ff", "#ff6b6b"], ["#43e97b", "#38f9d7"], ["#f7971e", "#ffd200"]][job.company.charCodeAt(0) % 3];

  return (
    <div className="page">
      <div className="container">
        <Link to="/jobs" className="back-link">← Back to Jobs</Link>

        {/* Hero */}
        <div className="job-detail-hero">
          <div className="job-detail-logo" style={{ background: `linear-gradient(135deg,${c1},${c2})` }}>
            {job.company[0]}
          </div>
          <h1 className="job-detail-title">{job.title}</h1>
          <div className="job-detail-company">{job.company}</div>
          <div className="job-card-meta">
            <span className="badge badge-location">📍 {job.location}</span>
            <span className="badge badge-type">{job.type}</span>
            {job.salary && <span className="badge badge-salary">💰 {job.salary}</span>}
          </div>
        </div>

        {/* Body */}
        <div className="job-detail-body">
          {/* Description */}
          <div className="job-detail-content card">
            <h3>About this Role</h3>
            <pre>{job.description}</pre>
            {job.skills?.length > 0 && (
              <>
                <h3>Required Skills</h3>
                <div className="job-card-skills" style={{ marginTop: "8px" }}>
                  {job.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="job-sidebar">
            <div className="sidebar-card">
              <h4>Job Overview</h4>
              <div className="sidebar-row"><span className="sidebar-key">Company</span><span className="sidebar-val">{job.company}</span></div>
              <div className="sidebar-row"><span className="sidebar-key">Location</span><span className="sidebar-val">{job.location}</span></div>
              <div className="sidebar-row"><span className="sidebar-key">Type</span><span className="sidebar-val">{job.type}</span></div>
              {job.salary && <div className="sidebar-row"><span className="sidebar-key">Salary</span><span className="sidebar-val">{job.salary}</span></div>}
              <div className="sidebar-row"><span className="sidebar-key">Posted</span><span className="sidebar-val">{formatDate(job.postedAt)}</span></div>
            </div>

            {user?.role !== "employer" && (
              <div className="sidebar-card">
                {applied ? (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>✅</div>
                    <div style={{ fontWeight: 700, color: "var(--accent3)", marginBottom: "4px" }}>Applied!</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text3)" }}>Your application is under review</div>
                    <Link to="/candidate/applications" className="btn btn-secondary btn-sm" style={{ marginTop: "12px", width: "100%", justifyContent: "center" }}>
                      View Applications
                    </Link>
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: "12px", fontSize: "0.875rem", color: "var(--text2)" }}>
                      Interested in this role? Apply now!
                    </div>
                    <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleApply}>
                      Apply Now →
                    </button>
                    {!user && (
                      <div style={{ marginTop: "10px", fontSize: "0.78rem", color: "var(--text3)", textAlign: "center" }}>
                        <Link to="/login" style={{ color: "var(--accent)" }}>Sign in</Link> to apply
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Apply for {job.title}</div>
            <div className="modal-sub">at {job.company} · {job.location}</div>
            <div className="form-group">
              <label className="form-label">Cover Letter (optional)</label>
              <textarea
                className="form-input" rows={5}
                placeholder="Tell the employer why you're a great fit for this role..."
                value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                style={{ minHeight: "120px" }}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitApplication} disabled={applying}>
                {applying ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

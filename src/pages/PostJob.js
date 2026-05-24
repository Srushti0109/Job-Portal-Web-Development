import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { saveJob, updateJob, getJobById } from "../utils/storage";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const LOCATIONS = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai", "Remote", "Other"];

const DEFAULT_FORM = {
  title: "", company: "", location: "", type: "Full-time",
  salary: "", description: "", skills: "",
};

export default function PostJob() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ ...DEFAULT_FORM, company: user?.company || "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const job = getJobById(id);
      if (!job || job.employerId !== user.id) { navigate("/employer/dashboard"); return; }
      setForm({ ...job, skills: (job.skills || []).join(", ") });
    }
  }, [id, isEdit, user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.company || !form.location || !form.description) {
      setError("Please fill in all required fields."); return;
    }
    setSaving(true);
    const skills = form.skills.split(",").map(s => s.trim()).filter(Boolean);
    const payload = { ...form, skills, employerId: user.id };

    setTimeout(() => {
      if (isEdit) {
        updateJob(id, payload);
        addToast("Job updated successfully! ✅", "success");
      } else {
        saveJob(payload);
        addToast("Job posted successfully! 🎉", "success");
      }
      navigate("/employer/dashboard");
    }, 400);
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: "700px" }}>
        <Link to="/employer/dashboard" className="back-link">← Back to Dashboard</Link>

        <div className="form-card">
          <h1 className="form-title">{isEdit ? "Edit Job" : "Post a New Job"}</h1>
          <p className="form-sub">{isEdit ? "Update your job listing details below." : "Fill in the details to attract the best candidates."}</p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Job Title *</label>
                <input name="title" className="form-input" placeholder="e.g. Senior React Developer"
                  value={form.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input name="company" className="form-input" placeholder="Your company"
                  value={form.company} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Location *</label>
                <select name="location" className="form-input filter-select" value={form.location} onChange={handleChange} required style={{ borderRadius: "var(--radius-sm)" }}>
                  <option value="">Select location</option>
                  {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Job Type *</label>
                <select name="type" className="form-input filter-select" value={form.type} onChange={handleChange} style={{ borderRadius: "var(--radius-sm)" }}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Salary / Package</label>
                <input name="salary" className="form-input" placeholder="e.g. ₹10–15 LPA"
                  value={form.salary} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea name="description" className="form-input" rows={8}
                placeholder="Describe the role, responsibilities, and requirements..."
                value={form.description} onChange={handleChange} required style={{ minHeight: "180px" }} />
            </div>

            <div className="form-group">
              <label className="form-label">Required Skills</label>
              <input name="skills" className="form-input" placeholder="React, Node.js, TypeScript (comma-separated)"
                value={form.skills} onChange={handleChange} />
              <div style={{ fontSize: "0.78rem", color: "var(--text3)", marginTop: "6px" }}>Separate skills with commas</div>
            </div>

            {error && <div className="form-error" style={{ marginBottom: "16px" }}>⚠️ {error}</div>}

            <div style={{ display: "flex", gap: "12px" }}>
              <Link to="/employer/dashboard" className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }}>Cancel</Link>
              <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: "center" }} disabled={saving}>
                {saving ? "Saving..." : isEdit ? "Update Job" : "Post Job →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

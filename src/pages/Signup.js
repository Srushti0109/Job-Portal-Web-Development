import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveUser, loginUser } from "../utils/storage";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "", role: "candidate" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const setRole = (role) => setForm({ ...form, role });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setTimeout(() => {
      const { user, error: err } = saveUser(form);
      if (err) { setError(err); setLoading(false); return; }
      loginUser(form.email, form.password);
      login(user);
      addToast(`Account created! Welcome, ${user.name.split(" ")[0]}! 🎉`, "success");
      navigate(user.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
    }, 400);
  };

  return (
    <div className="page">
      <div className="container form-page">
        <div className="form-card">
          <h1 className="form-title">Join HireNest</h1>
          <p className="form-sub">Create your free account today</p>

          <div style={{ marginBottom: "20px" }}>
            <div className="form-label" style={{ marginBottom: "10px" }}>I am a...</div>
            <div className="role-selector">
              <div className={`role-option ${form.role === "candidate" ? "selected" : ""}`} onClick={() => setRole("candidate")}>
                <div className="role-option-icon">🎓</div>
                <div className="role-option-label">Candidate</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: "4px" }}>Looking for jobs</div>
              </div>
              <div className={`role-option ${form.role === "employer" ? "selected" : ""}`} onClick={() => setRole("employer")}>
                <div className="role-option-icon">🏢</div>
                <div className="role-option-label">Employer</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: "4px" }}>Hiring talent</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input name="name" type="text" className="form-input" placeholder="Your full name"
                value={form.name} onChange={handleChange} required />
            </div>
            {form.role === "employer" && (
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input name="company" type="text" className="form-input" placeholder="TechCorp India"
                  value={form.company} onChange={handleChange} required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-input" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} required />
            </div>
            {error && <div className="form-error">⚠️ {error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }} disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p className="form-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

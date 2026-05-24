import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../utils/storage";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const { user, error: err } = loginUser(form.email, form.password);
      if (err) { setError(err); setLoading(false); return; }
      login(user);
      addToast(`Welcome back, ${user.name.split(" ")[0]}! 👋`, "success");
      navigate(user.role === "employer" ? "/employer/dashboard" : "/candidate/dashboard");
    }, 400);
  };

  const fillDemo = (role) => {
    if (role === "employer") setForm({ email: "employer@demo.com", password: "demo1234" });
    else setForm({ email: "candidate@demo.com", password: "demo1234" });
  };

  return (
    <div className="page">
      <div className="container form-page">
        <div className="form-card">
          <h1 className="form-title">Welcome back 👋</h1>
          <p className="form-sub">Sign in to your HireNest account</p>

          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            <button className="btn btn-secondary btn-sm" style={{ flex: 1, borderRadius: "8px" }} onClick={() => fillDemo("candidate")}>
              Demo Candidate
            </button>
            <button className="btn btn-secondary btn-sm" style={{ flex: 1, borderRadius: "8px" }} onClick={() => fillDemo("employer")}>
              Demo Employer
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                name="email" type="email" className="form-input"
                placeholder="you@example.com"
                value={form.email} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                name="password" type="password" className="form-input"
                placeholder="Enter your password"
                value={form.password} onChange={handleChange} required
              />
            </div>
            {error && <div className="form-error">⚠️ {error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="form-link">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

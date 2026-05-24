import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: "8rem", fontWeight: 800, color: "var(--border)", lineHeight: 1 }}>404</div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 700, marginBottom: "12px" }}>Page not found</h1>
        <p style={{ color: "var(--text2)", marginBottom: "28px" }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    </div>
  );
}

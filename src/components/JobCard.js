import React from "react";
import { useNavigate } from "react-router-dom";

const companyColors = [
  ["#6c63ff", "#ff6b6b"], ["#43e97b", "#38f9d7"], ["#f7971e", "#ffd200"],
  ["#ee0979", "#ff6a00"], ["#4facfe", "#00f2fe"], ["#a18cd1", "#fbc2eb"],
];

function getCompanyColor(name = "") {
  const idx = name.charCodeAt(0) % companyColors.length;
  return companyColors[idx];
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function JobCard({ job, actions }) {
  const navigate = useNavigate();
  const [c1, c2] = getCompanyColor(job.company);
  const initial = (job.company || "J")[0].toUpperCase();

  return (
    <div className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
      <div className="job-card-header">
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <div className="job-company-logo" style={{ background: `linear-gradient(135deg,${c1},${c2})` }}>
            {initial}
          </div>
          <div>
            <div className="job-card-title">{job.title}</div>
            <div className="job-card-company">{job.company}</div>
          </div>
        </div>
      </div>

      <div className="job-card-meta">
        <span className="badge badge-location">📍 {job.location}</span>
        <span className="badge badge-type">{job.type}</span>
        {job.salary && <span className="badge badge-salary">💰 {job.salary}</span>}
      </div>

      {job.skills?.length > 0 && (
        <div className="job-card-skills">
          {job.skills.slice(0, 4).map((s) => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
          {job.skills.length > 4 && <span className="skill-tag">+{job.skills.length - 4}</span>}
        </div>
      )}

      <div className="job-card-footer" onClick={(e) => e.stopPropagation()}>
        <span className="job-date">{timeAgo(job.postedAt)}</span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {actions}
          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/jobs/${job.id}`)}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

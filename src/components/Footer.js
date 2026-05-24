import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand" style={{ background: "linear-gradient(135deg,#6c63ff,#ff6b6b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              HireNest.
            </div>
            <p className="footer-desc">The modern way to find your next opportunity. Connecting talent with companies that care.</p>
          </div>
          <div>
            <div className="footer-heading">For Candidates</div>
            <ul className="footer-links">
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/signup">Create Profile</Link></li>
              <li><Link to="/candidate/applications">My Applications</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-heading">For Employers</div>
            <ul className="footer-links">
              <li><Link to="/employer/post-job">Post a Job</Link></li>
              <li><Link to="/employer/dashboard">Manage Listings</Link></li>
              <li><Link to="/signup">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-heading">Company</div>
            <ul className="footer-links">
              <li><a href="#!">About</a></li>
              <li><a href="#!">Careers</a></li>
              <li><a href="#!">Privacy Policy</a></li>
              <li><a href="#!">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} HireNest. Built with React & localStorage.</span>
          <span className="footer-copy">Made with ♥ for internship projects</span>
        </div>
      </div>
    </footer>
  );
}

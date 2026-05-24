import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getJobs } from "../utils/storage";
import JobCard from "../components/JobCard";

const JOB_TYPES = ["All Types", "Full-time", "Part-time", "Contract", "Internship", "Remote"];
const LOCATIONS = ["All Locations", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai", "Remote"];

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive search from URL — this reactive sync means navigating to /jobs
  // without a ?search param correctly clears the input even if the component
  // was already mounted with a previous search value.
  const urlSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(urlSearch);
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [sortBy, setSortBy] = useState("newest");

  // Keep local search input in sync when URL param changes externally
  // (e.g. clicking "Browse Jobs" nav link clears ?search from the URL)
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const all = getJobs();
    setJobs(all);
  }, []);

  useEffect(() => {
    let result = [...jobs];
    const q = search.toLowerCase();
    if (q) {
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        (j.skills || []).some(s => s.toLowerCase().includes(q)) ||
        j.location.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== "All Types") result = result.filter(j => j.type === typeFilter);
    if (locationFilter !== "All Locations") result = result.filter(j => j.location === locationFilter);
    if (sortBy === "newest") result.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    if (sortBy === "oldest") result.sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt));
    setFiltered(result);
  }, [jobs, search, typeFilter, locationFilter, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(search ? { search } : {});
  };

  const clearFilters = () => {
    setSearch(""); setTypeFilter("All Types"); setLocationFilter("All Locations");
    setSearchParams({});
  };

  return (
    <div className="page">
      <div className="container">
        <div className="section-header">
          <div>
            <h1 className="section-title">Browse All Jobs</h1>
            <div className="section-subtitle">{filtered.length} opportunit{filtered.length === 1 ? "y" : "ies"} found</div>
          </div>
        </div>

        {/* SEARCH */}
        <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
          <div className="search-bar" style={{ maxWidth: "100%" }}>
            <input
              className="search-input"
              placeholder="Search by title, company, skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
              🔍 Search
            </button>
          </div>
        </form>

        {/* FILTERS */}
        <div className="filter-bar">
          <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select className="filter-select" value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>
          <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          {(search || typeFilter !== "All Types" || locationFilter !== "All Locations") && (
            <button className="btn btn-secondary btn-sm" onClick={clearFilters}>✕ Clear Filters</button>
          )}
        </div>

        {/* RESULTS */}
        {filtered.length > 0 ? (
          <div className="jobs-grid">
            {filtered.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔎</div>
            <div className="empty-state-title">No jobs match your criteria</div>
            <div className="empty-state-sub" style={{ marginBottom: "20px" }}>Try adjusting your search or filters</div>
            <button className="btn btn-secondary" onClick={clearFilters}>Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

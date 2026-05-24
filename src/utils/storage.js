// ─── KEYS ────────────────────────────────────────────────────────────────────
export const KEYS = {
  USERS: "hn_users",
  JOBS: "hn_jobs",
  APPLICATIONS: "hn_applications",
  SESSION: "hn_session",
};

// ─── GENERIC ─────────────────────────────────────────────────────────────────
export const get = (key) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
};

export const set = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

// ─── USERS ───────────────────────────────────────────────────────────────────
export const getUsers = () => get(KEYS.USERS) || [];

export const saveUser = (user) => {
  const users = getUsers();
  const exists = users.find((u) => u.email === user.email);
  if (exists) return { error: "Email already registered." };
  const newUser = { ...user, id: Date.now().toString() };
  set(KEYS.USERS, [...users, newUser]);
  return { user: newUser };
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return { error: "Invalid email or password." };
  set(KEYS.SESSION, user);
  return { user };
};

export const getSession = () => get(KEYS.SESSION);

export const logout = () => localStorage.removeItem(KEYS.SESSION);

// ─── JOBS ─────────────────────────────────────────────────────────────────────
export const getJobs = () => get(KEYS.JOBS) || [];

export const getJobById = (id) => getJobs().find((j) => j.id === id) || null;

export const saveJob = (job) => {
  const jobs = getJobs();
  const newJob = {
    ...job,
    id: Date.now().toString(),
    postedAt: new Date().toISOString(),
  };
  set(KEYS.JOBS, [...jobs, newJob]);
  return newJob;
};

export const updateJob = (id, data) => {
  const jobs = getJobs();
  const updated = jobs.map((j) => (j.id === id ? { ...j, ...data, updatedAt: new Date().toISOString() } : j));
  set(KEYS.JOBS, updated);
};

export const deleteJob = (id) => {
  set(KEYS.JOBS, getJobs().filter((j) => j.id !== id));
  // Also remove related applications
  set(KEYS.APPLICATIONS, getApplications().filter((a) => a.jobId !== id));
};

// ─── APPLICATIONS ─────────────────────────────────────────────────────────────
export const getApplications = () => get(KEYS.APPLICATIONS) || [];

export const applyForJob = (jobId, candidateId, coverLetter) => {
  const apps = getApplications();
  const already = apps.find((a) => a.jobId === jobId && a.candidateId === candidateId);
  if (already) return { error: "You have already applied for this job." };
  const app = {
    id: Date.now().toString(),
    jobId,
    candidateId,
    coverLetter,
    appliedAt: new Date().toISOString(),
    status: "Applied",
  };
  set(KEYS.APPLICATIONS, [...apps, app]);
  return { app };
};

export const getApplicationsByCandidate = (candidateId) =>
  getApplications().filter((a) => a.candidateId === candidateId);

export const getApplicationsByJob = (jobId) =>
  getApplications().filter((a) => a.jobId === jobId);

export const updateApplicationStatus = (appId, status) => {
  const apps = getApplications().map((a) =>
    a.id === appId ? { ...a, status } : a
  );
  set(KEYS.APPLICATIONS, apps);
};

// ─── SEED DATA ────────────────────────────────────────────────────────────────
export const seedData = () => {
  if (getJobs().length > 0) return;

  const employerId = "employer-seed-1";
  const users = [
    { id: employerId, name: "TechCorp India", email: "employer@demo.com", password: "demo1234", role: "employer", company: "TechCorp India" },
    { id: "candidate-seed-1", name: "Arjun Sharma", email: "candidate@demo.com", password: "demo1234", role: "candidate", company: "" },
  ];
  set(KEYS.USERS, users);

  const jobs = [
    { id: "job-1", title: "Frontend Developer", company: "TechCorp India", location: "Bangalore", type: "Full-time", salary: "₹8–12 LPA", description: "We are looking for a skilled React developer to join our growing team. You will be responsible for building user-facing features using React.js.\n\nResponsibilities:\n• Build reusable components\n• Optimize application performance\n• Collaborate with designers\n\nRequirements:\n• 2+ years React experience\n• Strong HTML/CSS skills\n• Familiarity with REST APIs", skills: ["React", "JavaScript", "CSS", "Git"], employerId, postedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: "job-2", title: "Backend Engineer (Node.js)", company: "StartupXYZ", location: "Remote", type: "Full-time", salary: "₹10–16 LPA", description: "Join our backend team to build scalable APIs and services.\n\nResponsibilities:\n• Design RESTful APIs\n• Work with PostgreSQL & Redis\n• Deploy on AWS\n\nRequirements:\n• 3+ years Node.js\n• Database design experience\n• Docker knowledge", skills: ["Node.js", "PostgreSQL", "Docker", "AWS"], employerId, postedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: "job-3", title: "UI/UX Designer", company: "DesignStudio", location: "Mumbai", type: "Contract", salary: "₹6–9 LPA", description: "Create beautiful user experiences for our product suite.\n\nResponsibilities:\n• Design wireframes and prototypes\n• Conduct user research\n• Create design systems\n\nRequirements:\n• Portfolio with case studies\n• Figma expertise\n• Understanding of accessibility", skills: ["Figma", "User Research", "Prototyping", "Design Systems"], employerId, postedAt: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: "job-4", title: "Data Scientist", company: "Analytics Co.", location: "Hyderabad", type: "Full-time", salary: "₹12–20 LPA", description: "Use ML to derive insights from large datasets.\n\nResponsibilities:\n• Build ML models\n• Data wrangling and EDA\n• Present findings to stakeholders\n\nRequirements:\n• Python / R proficiency\n• ML framework experience\n• Statistics background", skills: ["Python", "TensorFlow", "SQL", "Statistics"], employerId, postedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: "job-5", title: "DevOps Engineer", company: "CloudBase", location: "Pune", type: "Full-time", salary: "₹14–22 LPA", description: "Maintain and improve our cloud infrastructure.\n\nResponsibilities:\n• CI/CD pipeline management\n• Kubernetes cluster administration\n• Incident response\n\nRequirements:\n• Kubernetes & Helm experience\n• Terraform proficiency\n• Strong Linux skills", skills: ["Kubernetes", "Terraform", "CI/CD", "AWS"], employerId, postedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: "job-6", title: "Product Manager", company: "ProductHouse", location: "Delhi", type: "Full-time", salary: "₹18–28 LPA", description: "Lead product strategy and execution.\n\nResponsibilities:\n• Define product roadmap\n• Work with engineering and design\n• Track KPIs\n\nRequirements:\n• 4+ years PM experience\n• Strong analytical skills\n• Excellent communication", skills: ["Product Strategy", "Analytics", "Agile", "Communication"], employerId, postedAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  ];
  set(KEYS.JOBS, jobs);
};

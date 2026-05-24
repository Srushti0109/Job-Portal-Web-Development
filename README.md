🌐 HireNest - Job Portal Web Application

HireNest is a role-based Job Portal web application built using React.js and LocalStorage. It allows candidates to browse and apply for jobs while employers can create and manage job listings through a dedicated dashboard.

🚀 Live Demo

🔗 https://job-portal-web-develaopmeny.vercel.app/

✨ Features
👤 Candidate Features
Browse job listings
View detailed job descriptions
Apply for jobs
Track applied jobs (stored in localStorage)
🏢 Employer Features
Add new job listings
Edit existing jobs
Delete job postings
View applicants for each job
🔐 Authentication System
Simple login and signup system
Role-based access:
Candidate
Employer
Session stored using localStorage
Redirect based on user role after login
🛠 Tech Stack
React.js
React Router DOM
Context API
JavaScript (ES6+)
HTML5 & CSS3
LocalStorage (for persistence)
📁 Project Structure
hirenest/
├── public/
├── src/
│   ├── components/      # Navbar, Footer, JobCard, etc.
│   ├── context/         # Auth and global state management
│   ├── pages/           # Home, Jobs, Dashboard, Auth pages
│   ├── styles/          # Global CSS files
│   ├── utils/           # LocalStorage helper functions
│   ├── App.js           # Routes and main app layout
│   └── index.js         # React entry point
├── package.json
└── README.md
⚙️ Setup Instructions
1. Clone Repository
git clone <your-github-repo-link>
cd hirenest
2. Install Dependencies
npm install
3. Run Development Server
npm start

Application runs at:

http://localhost:3000
🧠 How It Works
All data (users, jobs, applications) is stored in browser localStorage
React Context API manages authentication state
Role-based routing controls access to pages
Employers manage jobs dynamically from dashboard
Candidates interact with jobs without backend dependency

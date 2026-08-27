SIRAS-CCL
Safety Incident Reporting & Analytics System for Central Coalfields Limited (CCL), Ranchi
A full-stack MERN web application that digitizes the entire mine incident reporting workflow — from incident logging and investigation to analytics, corrective action tracking, and compliance reporting.
https://react.dev/
https://vitejs.dev/
https://nodejs.org/
https://expressjs.com/
https://www.mongodb.com/
LICENSE
Table of Contents
About
Features
Tech Stack
System Architecture
Database Schema
API Endpoints
Role-Based Access
Installation
Environment Variables
Deployment
Test Credentials
Screenshots
Future Scope
License
About
SIRAS-CCL replaces paper-based incident reporting at CCL mines with a secure, role-based digital platform accessible to all levels of mine safety personnel. The system provides real-time analytics, automated exports, and corrective action tracking — all essential for modern mine safety management and DGMS compliance.
Organization: Central Coalfields Limited (CCL), Ranchi
Project Type: Full-Stack Web Application
Internship: Web Development Internship
Features
Core Functionality
Real-time Digital Incident Reporting — Log incidents from any device with 30+ structured fields
Role-Based Access Control — 4 distinct roles with frontend + backend enforcement
Interactive Analytics Dashboard — KPI cards, line charts, bar charts, pie charts, and risk heatmaps
Automated Report Generation — Export incidents as CSV or PDF (single or bulk)
Corrective Action Tracking — Assign actions with deadlines, track status, and mark completion
DGMS Compliance Fields — Reportable incidents, investigation officers, and reference numbers
File Uploads — Attach photos and documents as incident evidence
Responsive UI — Works on desktop, tablet, and mobile browsers
Pages
Table
Page	Description
Login	JWT-based authentication with branded CCL login card
Dashboard	5 KPI cards + 3 interactive charts (trends, categories, severity)
Analytics	Full analytics suite with 6 data visualization sections
Incidents	Sortable, searchable table with filters and export buttons
Incident Detail	Complete incident view with all sections and PDF download
Report Incident	Multi-section form for creating new incidents
Edit Incident	Pre-filled form for updating existing incidents
Profile	Logged-in user info fetched from /api/auth/me
Roadmap	Phase 2 feature preview with animated cards
Tech Stack
Frontend
React 18 with Vite (fast HMR and optimized builds)
React Router DOM v6 (SPA routing)
Recharts (interactive data visualizations)
Axios (API calls with automatic JWT injection)
Lucide React (modern icon library)
Inline CSS (consistent dark blue theme, no external UI dependency)
Backend
Node.js + Express.js
MongoDB Atlas (cloud database)
Mongoose ODM (schema modeling)
JWT (jsonwebtoken) for stateless authentication
bcryptjs for password hashing
Multer for file uploads
cors for cross-origin security
Deployment
Backend: Render (Web Service)
Frontend: Vercel (Static Site)
Database: MongoDB Atlas
System Architecture
plain
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐      ┌─────────────┐
│ User Browser│ ←──→ │   Vercel     │ ←──→ │  Render Backend │ ←──→ │MongoDB Atlas│
│             │      │  (Frontend)  │      │   (API + Files) │      │ (Database)  │
└─────────────┘      └──────────────┘      └─────────────────┘      └─────────────┘
Frontend Flow
plain
AuthContext → global auth state
    ↓
api.js → Axios instance with Bearer token
    ↓
RoleRoute / PublicRoute → access guards
    ↓
Pages: Dashboard → Analytics → Incidents → Detail → Edit → Report → Profile → ComingSoon
Backend Flow
plain
server.js
    ├── Middleware: auth (JWT + role restrict), upload (Multer)
    ├── Controllers: auth, incident, analytics, report
    ├── Models: User, Incident
    └── Routes: /api/auth, /api/incidents, /api/analytics, /api/reports
Database Schema
User Collection
Table
Field	Type	Description
name	String	Full name
email	String	Unique email address
password	String	bcrypt hashed
role	String	admin, safety-officer, mine-manager, reporter
Incident Collection (30+ fields)
Table
Section	Fields
Basic	title, description, date, time, location, mine, area, incidentId
Classification	category (fire, roof-fall, machinery-breakdown, etc.), severity (critical/high/medium/low)
Status	open, under-investigation, closed
Persons	names, designations, equipment involved
Injury	type, body part, hospital, compensation
DGMS	reportable (yes/no), dgmsReference, investigationOfficer
Corrective Action	description, assignedTo, deadline, status (pending/in-progress/completed), completionDate
Reporter	name, email, phone, department
Files	uploaded photos/documents
Timestamps	createdAt, updatedAt
API Endpoints
Authentication
Table
Method	Endpoint	Description	Access
POST	/api/auth/register	Create new user	Admin only
POST	/api/auth/login	Login, returns JWT + user	Public
GET	/api/auth/me	Get current user profile	Authenticated
Incidents
Table
Method	Endpoint	Description	Access
GET	/api/incidents	List all (with filters)	Authenticated
POST	/api/incidents	Create new incident	Admin, Safety Officer, Reporter
GET	/api/incidents/:id	Get single incident	Authenticated
PUT	/api/incidents/:id	Update incident	Admin, Safety Officer
DELETE	/api/incidents/:id	Delete incident	Admin, Safety Officer
PATCH	/api/incidents/:id/corrective-action	Update action status	Admin, Safety Officer
Analytics
Table
Method	Endpoint	Description
GET	/api/analytics/summary	KPI cards data
GET	/api/analytics/trends	Monthly incident counts (line chart)
GET	/api/analytics/categories	Incidents by category (bar chart)
GET	/api/analytics/severity	Severity distribution (pie chart)
GET	/api/analytics/locations	Mine-wise stats table
GET	/api/analytics/corrective-actions	Action completion stats
GET	/api/analytics/risk-heatmap	Severity × category matrix
Reports
Table
Method	Endpoint	Description
GET	/api/reports/export/csv	Download all incidents as CSV
GET	/api/reports/export/pdf	Download all incidents as PDF
GET	/api/reports/pdf/:id	Download single incident PDF
Role-Based Access
Table
Feature	Admin	Safety Officer	Mine Manager	Reporter
Dashboard	✅	✅	✅	✅
Analytics	✅	✅	✅	❌
Incidents List	✅	✅	✅	✅
Incident Detail	✅	✅	✅	✅
Report Incident	✅	✅	❌	✅
Edit Incident	✅	✅	❌	❌
Delete Incident	✅	✅	❌	❌
Profile	✅	✅	✅	✅
Roadmap	✅	✅	✅	✅
Note: Backend APIs enforce the same restrictions. Unauthorized requests return 403 Forbidden.
Installation
Prerequisites
Node.js v18+
MongoDB (local or Atlas)
Git
1. Clone the Repository
bash
git clone https://github.com/Raunak-singh32/CCL-Internship-SIRAS.git
cd CCL-Internship-SIRAS
2. Setup Backend
bash
cd server
npm install
Create a .env file in the server/ directory (see Environment Variables).
bash
# Seed test data (optional)
node scripts/seedAdmin.js
node scripts/seedUsers.js
node scripts/seedIncidents.js

# Start development server
npm run dev
# or
node server.js
Backend runs on http://localhost:5000
3. Setup Frontend
bash
cd ../client
npm install
Create a .env file in the client/ directory:
env
VITE_API_URL=http://localhost:5000/api
bash
# Start development server
npm run dev
Frontend runs on http://localhost:5173
Environment Variables
Server (server/.env)
env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/siras-ccl?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
Client (client/.env)
env
VITE_API_URL=http://localhost:5000/api
Production: Update VITE_API_URL to your Render backend URL, e.g., https://siras-ccl-api.onrender.com/api
Deployment
Backend → Render
Push code to GitHub (ensure server/ is in the repo root)
Go to render.com → New Web Service
Connect your GitHub repo
Configure:
Name: siras-ccl-api
Root Directory: server
Build Command: npm install
Start Command: node server.js
Plan: Free
Add Environment Variables in Render dashboard:
MONGO_URI → your MongoDB Atlas connection string
JWT_SECRET → strong random string
NODE_ENV → production
Click Create Web Service
Copy the deployed URL (e.g., https://siras-ccl-api.onrender.com)
Frontend → Vercel
Go to vercel.com → New Project
Import your GitHub repo
Configure:
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Add Environment Variable:
VITE_API_URL → https://siras-ccl-api.onrender.com/api (your Render URL + /api)
Create client/vercel.json if not present:
JSON
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
Click Deploy
Post-Deployment Checklist
[ ] Backend health check returns 200 OK
[ ] Frontend loads without CORS errors
[ ] Login works with test credentials
[ ] Analytics charts render correctly
[ ] File uploads work
[ ] CSV/PDF exports download successfully
Test Credentials
Table
Role	Email	Password
Admin	admin@ccl.co.in	admin123
Safety Officer	safety@ccl.co.in	safety123
Mine Manager	manager@ccl.co.in	manager123
Reporter	reporter@ccl.co.in	reporter123
These are seeded via server/scripts/seedUsers.js
Project Structure
plain
SIRAS-CCL/
├── client/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Incidents.jsx
│   │   │   ├── IncidentDetail.jsx
│   │   │   ├── EditIncident.jsx
│   │   │   ├── ReportIncident.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── ComingSoon.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── server/                    # Express Backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── incidentController.js
│   │   ├── analyticsController.js
│   │   └── reportController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Incident.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── incidentRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── reportRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── scripts/
│   │   ├── seedAdmin.js
│   │   ├── seedUsers.js
│   │   └── seedIncidents.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
Future Scope
Phase 2 Features
SMS & Email Alerts — Twilio/Nodemailer for critical incident notifications
Mobile Field App — React Native/PWA for offline mine reporting
AI Risk Prediction — ML model for high-risk zone prediction
DGMS Portal Integration — Direct API sync with DGMS compliance portal
Offline Mode — PWA with localStorage auto-sync
Multi-Language — Hindi + English toggle
Advanced BI Reports — Drill-down dashboards with custom date ranges
IoT Sensor Feed — Real-time gas, temperature, ventilation data
Key Achievements
✅ Built complete full-stack application from scratch
✅ Implemented JWT authentication with bcrypt hashing
✅ Designed role-based access control (4 roles, frontend + backend)
✅ Created 7 analytics endpoints with Recharts visualizations
✅ Automated CSV and PDF report generation
✅ Built responsive UI with inline CSS (no external UI library dependency)
✅ Integrated file upload for incident evidence
✅ Seeded realistic test data (35 incidents across categories and mines)
✅ Prepared for cloud deployment (Render + Vercel)
✅ Clean code structure with MVC pattern
License
This project was developed as part of an internship at Central Coalfields Limited (CCL), Ranchi.
plain
MIT License

Copyright (c) 2026 Raunak Singh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
Contact
Raunak Singh
GitHub: @Raunak-singh32
Project Link: https://github.com/Raunak-singh32/CCL-Internship-SIRAS
<p align="center">
  <sub>Built with ❤️ during internship at Central Coalfields Limited, Ranchi</sub>
</p>
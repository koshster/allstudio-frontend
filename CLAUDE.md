# AllStudio Frontend

## Project Overview
AllStudio is a boutique fitness studio CRM and retention dashboard. 
It is a B2B SaaS prototype designed to be pitched to small fitness 
studios (yoga, pilates, lagree, etc.) in San Diego and similar markets.

The core differentiator is a churn prediction algorithm that scores 
clients by risk of dropping off, so studio owners can proactively 
re-engage them before they leave.

## Tech Stack
- React 18 (Vite)
- Tailwind CSS
- Axios for HTTP requests
- React Router for navigation
- JWT authentication (tokens stored in localStorage)

## Backend
- Spring Boot 4.x running on http://localhost:8080
- All API endpoints are prefixed with /api
- Auth endpoints: POST /api/auth/login, POST /api/auth/register
- Protected endpoints require: Authorization: Bearer <token> header
- CORS is configured to allow http://localhost:5173

## Auth Flow
1. User logs in via POST /api/auth/login with { email, password }
2. Backend returns { token: "eyJ..." }
3. Token is stored in localStorage under the key "token"
4. Axios interceptor attaches token to every request automatically
5. If token is missing or expired, redirect to /login

## Folder Structure
src/
├── components/       # Reusable UI components
├── pages/            # Full page components (Login, Dashboard, Clients, etc.)
├── services/         # Axios instance and API call functions
├── context/          # React context for auth state
└── App.jsx           # Routes defined here

## Design Guidelines
- Clean, modern, professional SaaS aesthetic
- Color palette: dark sidebar (#1a1a2e), white main content, 
  accent color #6C63FF (purple)
- Font: Inter (import from Google Fonts)
- Use Tailwind utility classes for all styling
- No component libraries — build everything custom with Tailwind
- Sidebar navigation with icons for: Dashboard, Clients, Classes, Schedule, Settings
- Mobile responsive is not a priority for this prototype

## Key Pages to Build
1. Login page — email/password form, POST to /api/auth/login
2. Dashboard — churn risk overview, key stats, at-risk client list
3. Clients — full client list, add/edit client, client profile page
4. Classes — class types and scheduled sessions
5. Schedule — weekly calendar view of class sessions

## Key Components to Build
- Sidebar — persistent navigation
- StatCard — displays a metric (total clients, at-risk count, revenue)
- ClientRow — single client in a list with churn score indicator
- ChurnBadge — color coded risk indicator (green/yellow/red)
- Modal — reusable modal wrapper for forms

## Conventions
- All API calls go through src/services/api.js (axios instance)
- Auth state managed via React Context in src/context/AuthContext.jsx
- Pages live in src/pages/, components in src/components/
- Use functional components and hooks only, no class components
- Always handle loading and error states in components that fetch data
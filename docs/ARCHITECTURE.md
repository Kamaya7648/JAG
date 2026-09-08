# JAG (GarageSync / SyncBoard) — Architecture & Branching Strategy

## 1. Overview

JAG is a full-stack vehicle service management system. It lets garage staff
track assigned vehicles, view/update repair status on a Trello-style board,
and manage customer and service data end-to-end.

## 2. Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React 18, Vite, React Router         |
| Backend    | Node.js, Express                     |
| Database   | MongoDB                              |
| Styling    | Plain CSS (navy / orange / white theme) |
| CI/CD      | GitHub Actions                       |
| API Docs   | Postman / Swagger                    |

## 3. Project Structure

```
JAG/
├── .github/
│   └── workflows/
│       └── ci.yml            # CI/CD pipeline (GitHub Actions)
├── backend/
│   ├── controllers/           # Business logic per resource
│   ├── routes/                 # Express route definitions (REST API)
│   ├── server.js                # App entry point
│   └── .env.example               # Sample environment variables
├── database/
│   ├── config.js                    # MongoDB connection setup
│   ├── models/                       # Mongoose schemas
│   └── seed.js                        # Sample data script
├── frontend/
│   ├── public/                          # Static assets served as-is
│   ├── src/
│   │   ├── assets/                       # Icons, images
│   │   ├── components/                    # Reusable UI (Sidebar, Card, Column, etc.)
│   │   ├── context/                        # React context providers
│   │   ├── pages/                           # Route-level pages (Dashboard, Board)
│   │   ├── App.jsx                           # Route definitions
│   │   ├── App.css                            # Global styling
│   │   ├── data.js                             # Sample/static data
│   │   └── main.jsx                             # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── TEST_REPORT.md
└── README.md
```

The database layer (`database/`) is kept separate from `backend/` — the backend handles
requests and business logic, while the database folder owns the MongoDB connection,
schema definitions, and seed data. This keeps the data layer testable and swappable
independent of the API layer.

## 4. High-Level Architecture

```
┌─────────────┐      REST API (JSON)      ┌──────────────┐      Mongoose      ┌───────────┐
│   Frontend  │  <──────────────────────>  │   Backend    │  <──────────────>  │  MongoDB  │
│  React/Vite │       fetch / axios        │ Node/Express │                    │  Database │
└─────────────┘                            └──────────────┘                    └───────────┘
      │                                            │
      │  src/pages, src/components                 │  routes → controllers → models
      │  client-side routing (React Router)         │  business logic + validation
```

- **Frontend** renders the vehicle dashboard and per-vehicle service board,
  and calls the backend's REST endpoints for data.
- **Backend** exposes REST routes (e.g. `/api/vehicles`) that are handled by
  controllers, which read/write data through Mongoose models.
- **Database** persists vehicles, customers, and service/board data in
  MongoDB collections.

## 5. Git Branching Strategy

We use a **feature-branch workflow**: `main` always stays deployable, and
all changes are made on short-lived branches merged in via Pull Request.

```
main ──●──●───────────────────●──●──   (always deployable)
        \                     /
         ●──●──●  feature/frontend
              (merged via PR)
```

| Branch pattern       | Scope                                          |
|-----------------------|-------------------------------------------------|
| `main`                | Stable, deployable code only                    |
| `feature/frontend`    | Changes inside `frontend/src` (UI, pages, components) |
| `feature/backend`     | Changes inside `backend/routes`, `backend/controllers` |
| `feature/database`    | Changes inside `database/config.js`, `database/models`, `database/seed.js` |
| `fix/<short-name>`    | Small, scoped bug fixes                          |

**Workflow for every change:**
1. Branch off the latest `main`.
2. Make changes scoped to that branch's purpose.
3. Commit with clear, specific messages.
4. Push and open a Pull Request against `main`.
5. Review, ensure CI checks pass, then merge.
6. Delete the branch and sync `main` locally before starting the next one.

## 6. Team Roles / Work Breakdown

*(fill in with your team's actual role split, e.g.)*

| Member                     | Area                          |
|------------------------------|--------------------------------|
| Kamaya                        | Frontend (Dashboard, Board UI) |
| OAhewavitharane                | Backend (routes, API)          |
| Senuri Sathsarani                | Backend structure / integration |
| Dawundage Krishan Kanishka          | Database (MongoDB, models)     |

## 7. Limitations / Future Improvements

- Board state persistence relies on MongoDB — ensure all board updates are
  synced through the API rather than kept only in local component state.
- Add authentication/authorization for staff logins.
- Add automated test coverage for backend routes and controllers.

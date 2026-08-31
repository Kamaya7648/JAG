# JAG — Garage Management System

A web-based application for digitizing and managing the daily operations of a vehicle service garage — vehicle tracking, a Kanban-style service board, appointments, reports, analytics, and garage settings, all from a single dashboard.

**Repository:** https://github.com/Kamaya7648/JAG

---

## Tech Stack

- **Frontend:** React, Vite, JavaScript, React Router, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (installed locally; integration in progress)
- **API Testing:** Postman

---

## Features

- Authentication (register / login / protected routes)
- Dashboard with quick access to all modules
- Vehicle management (add, view, update, delete)
- Kanban-style service board for tracking repair progress
- Task management per vehicle
- Report generation (mechanic performance, revenue, completion stats)
- Calendar & appointment scheduling
- Garage event management
- Analytics overview
- Supervisor profile management
- Configurable garage settings

---

## Project Structure

```
JAG/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── data/
│   └── models/
│
├── src/                  # React frontend source
├── public/
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm
- MongoDB (if running with database integration)

### 1. Clone the repository

```bash
git clone https://github.com/Kamaya7648/JAG.git
cd JAG
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

The backend runs by default at:
```
http://localhost:5000
```

### 3. Frontend Setup

Open a new terminal at the project root:

```bash
npm install
npm run dev
```

The frontend runs by default at:
```
http://localhost:5173
```

Make sure the frontend's API base URL points to the running backend (check your `.env` or API config file).

### 4. Production Build

```bash
npm run build
```

This generates an optimized build in the `dist/` directory.

---

## Roadmap

- [ ] Complete MongoDB integration (replace mock data with persistent storage)
- [ ] Password hashing and JWT/session-based authentication
- [ ] Role-based access control (Admin, Mechanic, Customer)
- [ ] Real-time service board updates
- [ ] Notifications
- [ ] Deployment

---




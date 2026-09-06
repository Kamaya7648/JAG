# JAG - Garage and Workshop Management System

## Assignment 03 – Working Full-Stack Application

Garage and Workshop Management System named JAG is a full-stack web application developed to manage the daily operations of a vehicle garage. The system provides a centralized platform for supervisors and garage staff to manage vehicles, service tasks, appointments, reports, analytics, profiles, and garage settings.

The application consists of a React frontend, Node.js and Express backend REST APIs, and MongoDB database integration.

---

# 1. Project Introduction

The Garage and Workshop Management System is designed to improve the efficiency of garage operations by replacing manual vehicle and service management processes with a centralized digital system.

The system allows garage supervisors to:

- Manage registered vehicles
- View assigned vehicles
- Add new vehicles
- Manage vehicle service tasks
- Track service progress using a Kanban-style board
- Schedule and manage appointments
- Generate vehicle and mechanic performance reports
- View garage analytics
- Manage supervisor profiles
- Configure garage settings
- Manage user authentication

The application follows a full-stack architecture where the React frontend communicates with the Node.js and Express backend through REST APIs. The backend communicates with MongoDB for persistent data storage.

---

# 2. Main Objectives

The main objectives of the project are:

- Develop a responsive React-based garage management interface.
- Implement reusable frontend components.
- Develop RESTful backend APIs using Node.js and Express.
- Implement user registration and authentication.
- Manage vehicle information.
- Manage vehicle service tasks.
- Provide a Kanban-style vehicle service board.
- Provide appointment and calendar management.
- Provide report generation.
- Provide analytics and performance information.
- Provide supervisor profile management.
- Provide garage configuration and settings.
- Integrate the application with MongoDB.
- Test the complete frontend, backend, and database workflow.

---

# 3. Main Features

## Authentication

- User registration
- User login
- Password validation
- Authentication handling
- Session management

## Dashboard

- Today's vehicle information
- Vehicles currently in repair
- Completed vehicles
- Monthly revenue
- Previous-day comparison
- Workshop activity overview

## Assigned Vehicles

- View assigned vehicles
- View vehicle details
- View service information
- Access vehicle service board

## Vehicle Management

- Add new vehicles
- Update vehicle information
- Delete vehicle information
- Validate vehicle data

## Service Board

- Kanban-style service workflow
- Task creation
- Task editing
- Task deletion
- Task movement between service stages
- Vehicle-specific tasks

## Calendar

- View scheduled appointments
- Add appointments
- Update appointments
- Delete appointments
- View customer and vehicle service information

## Reports

- Generate reports
- View generated reports
- Mechanic performance reports
- Vehicle statistics
- Revenue information
- Average service time

## Analytics

- Daily vehicle statistics
- Vehicles currently in repair
- Completed vehicles
- Monthly revenue
- Previous-period comparisons

## Profile

- View supervisor profile
- Update profile information

## Settings

- Garage information
- Contact information
- Currency
- Date format
- Time format
- Timezone
- Language
- Email notifications
- Automatic backup
- Low-stock alerts
- Job-completion alerts
- Default application view
- Sidebar preferences
- Dark mode preference

---

# 4. Technology Stack

## Frontend

- React
- Vite
- JavaScript
- CSS
- React Router
- Lucide React

## Backend

- Node.js
- Express.js
- REST API
- JavaScript

## Database

- MongoDB
- MongoDB Atlas

## API Testing

- Postman

## Development Tools

- Visual Studio Code
- Git
- GitHub
- PowerShell
- MongoDB Shell

---

# 5. System Architecture

```text
                         GMS APPLICATION

                    ┌─────────────────────┐
                    │    React Frontend   │
                    │                     │
                    │ Login               │
                    │ Registration        │
                    │ Dashboard           │
                    │ Vehicles            │
                    │ Add Vehicle         │
                    │ Board               │
                    │ Calendar            │
                    │ Reports             │
                    │ Analytics           │
                    │ Profile             │
                    │ Settings            │
                    └──────────┬──────────┘
                               │
                               │ HTTP / JSON
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Node.js + Express  │
                    │                     │
                    │ Routes              │
                    │ Controllers         │
                    │ REST APIs           │
                    │ Validation          │
                    └──────────┬──────────┘
                               │
                               │ Mongoose
                               │
                               ▼
                    ┌─────────────────────┐
                    │    MongoDB Atlas    │
                    │                     │
                    │ Users               │
                    │ Vehicles            │
                    │ Tasks               │
                    │ Appointments        │
                    │ Reports             │
                    │ Events              │
                    │ Profiles            │
                    │ Settings            │
                    └─────────────────────┘

```
---

# 6. Project Structure
```text
JAG/
│
├── backend/
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── vehicleController.js
│   │   ├── taskController.js
│   │   ├── reportController.js
│   │   ├── calendarController.js
│   │   ├── eventController.js
│   │   ├── analyticsController.js
│   │   ├── profileController.js
│   │   └── settingsController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── calendarRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── profileRoutes.js
│   │   └── settingsRoutes.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   ├── Task.js
│   │   ├── Appointment.js
│   │   ├── Report.js
│   │   ├── Event.js
│   │   ├── Profile.js
│   │   └── Settings.js
│   │
│   ├── data/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── database/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── Sidebar/
│   │   ├── Settings/
│   │   ├── Profile/
│   │   ├── Login/
│   │   ├── Register/
│   │   └── WelcomeGreeting/
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Board.jsx
│   │   ├── AddVehicle.jsx
│   │   ├── ReportGeneration.jsx
│   │   ├── Calendar.jsx
│   │   └── Analytics.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```


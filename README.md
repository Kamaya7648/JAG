# JAG - Garage and Workshop Management System

## Assignment 03 – Working Full-Stack Application

JAG (Garage and Workshop Management System) is a full-stack web application designed to manage the daily operations of a vehicle garage and workshop. The system provides a centralized platform for supervisors and garage staff to manage vehicles, service tasks, appointments, reports, analytics, profiles, and garage settings.

The application consists of a React frontend, Node.js and Express backend REST APIs, and MongoDB database integration.

---

# 1. Project Introduction

The Garage and Workshop Management System is designed to improve the efficiency of garage operations by replacing manual vehicle and service management processes with a centralized digital system.

The system allows authorized users to:

- Register and log into the system
- Manage registered vehicles
- Add and update vehicle information
- Manage vehicle service tasks
- Track service progress using a Kanban-style board
- Schedule and manage calendar events
- Generate vehicle and service reports
- View garage analytics
- View and manage profile information
- Configure garage settings

The React frontend communicates with the Node.js and Express backend through REST APIs. The backend communicates with MongoDB for persistent data storage.

---

# 2. Main Objectives

The main objectives of the project are:

- Develop a responsive React-based garage management interface
- Implement reusable frontend components
- Develop RESTful backend APIs using Node.js and Express
- Implement user registration and authentication
- Secure API access using JWT authentication
- Manage vehicle information
- Manage vehicle service tasks
- Provide a Kanban-style vehicle service board
- Provide calendar and event management
- Provide report generation
- Provide analytics and performance information
- Provide supervisor profile information
- Provide garage configuration and settings
- Integrate the application with MongoDB
- Maintain user-specific data isolation
- Test the complete frontend, backend, and database workflow

---

# 3. Main Features

## Authentication

- User registration
- User login
- Password validation
- Password hashing using bcrypt
- JWT-based authentication
- Protected backend routes
- Session information stored on the frontend
- Logout functionality
- User-specific data access

## Dashboard

The dashboard provides an overview of garage activity, including:

- Today's vehicle information
- Vehicles currently in repair
- Completed vehicles
- Monthly revenue
- Workshop activity
- Vehicle-related statistics

## Vehicle Management

Users can:

- Add new vehicles
- View vehicles
- View vehicle details
- Update vehicle information
- Delete vehicle information
- Associate vehicles with the authenticated user

## Service Board

The system provides a Kanban-style service board for managing vehicle service tasks.

Features include:

- Task creation
- Task editing
- Task deletion
- Task movement between service stages
- Vehicle-specific tasks
- Persistent task data
- Drag-and-drop task management

## Calendar

The calendar provides event management functionality.

Features include:

- View scheduled events
- Add events
- Delete events
- Store event information in MongoDB
- Load events for the authenticated user

## Reports

The report generation page provides information based on the actual vehicle data stored in the system.

Reports include:

- Vehicle statistics
- Vehicle status information
- Revenue information
- Service categories
- Mechanic-related statistics
- Service performance information

## Analytics

The analytics section provides statistical information based on the current vehicle data.

Examples include:

- Vehicles today
- Vehicles currently in repair
- Completed vehicles
- Monthly revenue
- Garage activity statistics

## Profile

The profile page displays authenticated user information, including:

- Name
- Employee ID
- Department
- Email
- Phone number
- Role
- Account information
- Profile image when available

## Settings

The settings section allows users to manage garage and application preferences, including:

- Garage information
- Contact information
- Currency
- Date format
- Time format
- Timezone
- Language
- Email notifications
- Automatic backup preference
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
- React Icons
- Recharts

## Backend

- Node.js
- Express.js
- REST API
- JavaScript
- JSON Web Token (JWT)
- bcryptjs
- Mongoose
- CORS
- dotenv

## Database

- MongoDB
- MongoDB Atlas

## Development Tools

- Visual Studio Code
- Git
- GitHub
- PowerShell
- MongoDB Compass
- MongoDB Shell
- Postman

---

# 5. System Architecture

```text
                         JAG APPLICATION
                              |
                 +------------+------------+
                 |                         |
                 v                         |
        +-------------------+              |
        |   React Frontend  |              |
        |                   |              |
        | Login             |              |
        | Register          |              |
        | Dashboard         |              |
        | Add Vehicle       |              |
        | Board             |              |
        | Calendar          |              |
        | Reports           |              |
        | Analytics         |              |
        | Profile           |              |
        | Settings          |              |
        +---------+---------+              |
                  |                        |
                  | HTTP / JSON            |
                  | JWT Bearer Token       |
                  v                        |
        +-------------------+              |
        | Node.js + Express |              |
        |                   |              |
        | Routes            |              |
        | Controllers       |              |
        | Authentication    |              |
        | Middleware        |              |
        | REST APIs         |              |
        +---------+---------+              |
                  |                        |
                  | Mongoose               |
                  v                        |
        +-------------------+              |
        |   MongoDB Atlas   |              |
        |                   |              |
        | Users             |              |
        | Vehicles          |              |
        | Tasks             |              |
        | Events            |              |
        | Settings          |              |
        +-------------------+              |
```
# 6. Project Structure

```text
JAG/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── settingsController.js
│   │   ├── taskController.js
│   │   └── vehicleController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── settingsRoutes.js
│   │   ├── taskRoutes.js
│   │   └── vehicleRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── database/
│   ├── config/
│   │   └── db.js
│   │
│   └── models/
│       ├── Event.js
│       ├── Settings.js
│       ├── Task.js
│       ├── User.js
│       └── Vehicle.js
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │
│   │   ├── components/
│   │   │   ├── Settings/
│   │   │   ├── StatCards/
│   │   │   ├── WelcomeGreeting/
│   │   │   ├── AddColumn.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Column.jsx
│   │   │   ├── ColumnFilter.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   ├── Profile/
│   │   │   ├── Register/
│   │   │   ├── AddVehicle.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Board.jsx
│   │   │   ├── Calendar.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ReportGeneration.jsx
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── package-lock.json
│
├── docs/
├── .gitignore
└── README.md
```

---

# 7. Backend API Structure

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

Authentication endpoints are used for creating accounts and logging into the system.

## Vehicles

```text
GET    /api/vehicles
GET    /api/vehicles/:id
POST   /api/vehicles
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id
```

Vehicle routes are protected using JWT authentication.

## Tasks

```text
GET    /api/tasks/:vehicleId
POST   /api/tasks
PUT    /api/tasks/:id
PATCH  /api/tasks/:id/move
DELETE /api/tasks/:id
```

Task routes are protected and operate on the authenticated user's data.

## Events

```text
GET    /api/events
POST   /api/events
DELETE /api/events/:id
```

Event routes are protected using JWT authentication.

## Settings

```text
GET /api/settings
PUT /api/settings
```

Settings are associated with the authenticated user.

## Health Check

```text
GET /api/health
```

The health endpoint is used to verify that the backend server is running correctly.

---

# 8. Authentication and Security

The application uses JWT-based authentication.

The authentication process works as follows:

```text
User
 |
 | Register
 v
Backend
 |
 | Password hashing
 v
MongoDB
 |
 | Login
 v
Backend
 |
 | Verify email/password
 v
JWT Token
 |
 v
Frontend
 |
 | Bearer Token
 v
Protected API Routes
```

## Password Security

Passwords are hashed using bcrypt before being stored in MongoDB.

The original password is never stored as plain text.

## JWT Authentication

After successful login, the backend generates a JWT token.

The frontend sends the token with protected API requests using:

```text
Authorization: Bearer <token>
```

The authentication middleware verifies the token before allowing access to protected routes.

## User Data Isolation

Vehicle, task, event, and settings data are associated with the authenticated user.

This prevents one registered user from accessing another user's application data.

---

# 9. Database Structure

The application uses MongoDB with Mongoose.

## User

Stores authenticated user information such as:

- Name
- Employee ID
- Phone
- Email
- Department
- Experience
- Password hash
- Role
- Account information

## Vehicle

Stores vehicle-related information and associates vehicles with their owner.

## Task

Stores service tasks associated with vehicles and users.

## Event

Stores calendar and scheduling information associated with users.

## Settings

Stores application and garage preferences associated with users.

---

# 10. Frontend Pages

## Login

Allows registered users to enter their email and password and authenticate with the backend.

## Register

Allows new users to create an account by entering their personal and employee information.

## Dashboard

Provides an overview of garage activity and vehicle statistics.

## Add Vehicle

Allows users to register new vehicles in the system.

## Board

Provides a Kanban-style interface for managing vehicle service tasks.

## Calendar

Provides calendar-based event management.

## Report Generation

Generates reports using the current vehicle and service information.

## Analytics

Displays garage statistics and performance information.

## Profile

Displays information about the currently authenticated user.

## Settings

Provides application and garage configuration options.                                                                                                             
# 11. Data Flow

The main application data flow is:

```text
React Frontend
      |
      | HTTP Request
      | JWT Token
      v
Express Routes
      |
      v
Authentication Middleware
      |
      v
Controllers
      |
      v
Mongoose Models
      |
      v
MongoDB Atlas
      |
      | Response
      v
Controllers
      |
      v
React Frontend
```

---

# 12. Environment Configuration

The backend uses environment variables for configuration.

Example:

```text
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

The `.env` file contains private configuration values and should not be committed to GitHub.

---

# 13. Running the Project Locally

## Backend

Open a terminal inside the backend folder:

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

The health endpoint can be tested using:

```text
http://localhost:5000/api/health
```

## Frontend

Open another terminal inside the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Vite will provide the local frontend development URL.

---

# 14. Production Build

The frontend can be tested using the production build command:

```bash
npm run build
```

The build process verifies that the React application can be compiled successfully for production.

---

# 15. GitHub and Version Control

The project uses Git and GitHub for source-code management.

The main branch is:

```text
main
```

Typical workflow:

```bash
git pull origin main
```

Make changes and test the application.

Then:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Team members can obtain the latest project using:

```bash
git pull origin main
```
# 16. Continuous Integration

The project includes a GitHub Actions workflow.

The CI workflow checks the backend and frontend when changes are pushed to the repository.

The workflow includes:

- Backend dependency installation
- Backend syntax checking
- Frontend dependency installation
- Frontend linting
- Frontend production build

This helps identify problems before changes are considered complete.

---

# 17. Testing

The application was tested across the main full-stack workflow.

Testing includes:

- User registration
- User login
- JWT authentication
- Protected API requests
- Vehicle creation
- Vehicle updates
- Vehicle deletion
- Vehicle retrieval
- Task creation
- Task editing
- Task deletion
- Task movement
- Calendar event management
- Settings management
- Report generation
- Analytics
- Logout and re-login
- User data isolation
- MongoDB data persistence
- Frontend production build

---

# 18. Current System Workflow

```text
                    START
                      |
                      v
                 Login/Register
                      |
                      v
                Authentication
                      |
                      v
                  Dashboard
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
       Vehicles      Board     Calendar
          |           |           |
          v           v           v
      Vehicle      Service      Events
      Management    Tasks       Management
          |           |
          +-----+-----+
                |
                v
          Reports / Analytics
                |
                v
          Profile / Settings
                |
                v
              Logout
                |
                v
               END
```

---

# 19. Project Status

The project currently contains:

- React frontend
- Vite development environment
- Node.js backend
- Express REST APIs
- MongoDB database integration
- JWT authentication
- bcrypt password hashing
- Protected API routes
- User-specific data isolation
- Vehicle management
- Service task management
- Kanban-style service board
- Calendar/event management
- Report generation
- Analytics
- Profile page
- Settings
- GitHub version control
- GitHub Actions CI workflow

The frontend and backend have been integrated and the application supports persistent database-backed functionality.

---

# 20. Conclusion

JAG provides a full-stack garage and workshop management platform that connects a React-based user interface with a Node.js and Express backend and MongoDB database.

The system demonstrates frontend development, REST API development, database integration, authentication, authorization, data persistence, reusable components, service task management, reporting, analytics, and version control.

The architecture provides a foundation that can be extended with additional garage management features in the future.

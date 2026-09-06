# JAG Backend

Express + MongoDB (Mongoose) backend for the JAG garage management app,
built to match the existing `garage-dashboard` frontend exactly.

## Setup

1. Copy `.env.example` to `.env` and fill in your MongoDB connection string:
   ```
   cp .env.example .env
   ```
   Get a connection string from MongoDB Atlas (or your local MongoDB instance)
   and paste it in as `MONGODB_URI`.

2. Install dependencies:
   ```
   npm install
   ```

3. Run the server:
   ```
   npm run dev
   ```
   (or `npm start` for a plain run without auto-reload)

The server listens on `http://localhost:5000` by default — matching the URL
already hardcoded in the frontend's `fetch()` calls.

## API

### Auth
- `POST /api/auth/register` — body: `{ name, email, password }`
- `POST /api/auth/login` — body: `{ email, password }` → `{ user }`

### Vehicles
- `GET /api/vehicles` — list all vehicles
- `GET /api/vehicles/:id` — get one vehicle by its garage-assigned ID (e.g. `"008"`)
- `POST /api/vehicles` — body: `{ id, model, plate, status, customerName, customerAddress, phone }`

### Tasks (service board)
- `GET /api/tasks/:vehicleId` — all tasks for a vehicle (including the `"tasklist"` column)
- `POST /api/tasks` — body: `{ vehicleId, text, days, columnId }`
- `PUT /api/tasks/:id` — body: `{ text, days }`
- `PATCH /api/tasks/:id/move` — body: `{ columnId }`
- `DELETE /api/tasks/:id`

## Notes

- Passwords are hashed with bcrypt before storage.
- Vehicle status is restricted to: `Received`, `Diagnosis`, `Repairing`,
  `Quality Check`, `Completed`.
- The frontend's Login/Register flow doesn't currently send an auth token on
  later requests (just a `sessionStorage` flag), so these routes aren't
  protected by middleware yet. If you want real session security, that's a
  good next addition (e.g. JWT issued on login, checked on protected routes).
- Calendar, Analytics, Settings, and Report Generation pages in the frontend
  are still using local/mock data — no backend routes exist for them yet.
  Happy to add those next if you want them persisted too.

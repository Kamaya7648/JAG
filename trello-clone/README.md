# GarageSync — Database Management + Service Board

A two-page React app for the Fullstack Development module assignment:

1. **Dashboard** (`/`) — a vehicle database table styled after the
   GarageSync reference design (navy sidebar, orange accents, white
   content area). Columns: Vehicle ID, Vehicle Model, Number Plate,
   Vehicle Status, and a **Service Board** link per row.
2. **Service Board** (`/board/:vehicleId`) — a Trello-style kanban board
   for that specific vehicle's repair job. Columns represent the repair
   pipeline (Received -> Diagnosis -> Repairing -> Quality Check ->
   Completed); cards represent tasks, each with an editable
   **days-to-complete** estimate.

## Features
- Search the vehicle table live
- Add, edit, delete, and drag-and-drop tasks between stages on each
  vehicle's board
- Add, rename, and delete board columns
- Fully responsive

## Tech
React 18 + Vite + React Router, plain CSS (no UI framework), vanilla JS
drag-and-drop (no extra library).

## Run it locally
```bash
npm install
npm run dev
```
Then open the local URL Vite prints (usually http://localhost:5173).

## Build for submission/deployment
```bash
npm run build
```
Output goes to `dist/`.

## Project structure
```
src/
  App.jsx                 route definitions (Dashboard, Board)
  App.css                 all styling (navy / orange / white theme)
  data.js                 sample vehicle data + status colors + board template
  pages/
    Dashboard.jsx           vehicle table + sidebar layout
    Board.jsx                per-vehicle kanban board
  components/
    Sidebar.jsx              navy sidebar nav
    Column.jsx               a single board stage
    Card.jsx                  a single task (edit/delete, days-to-complete)
    AddColumn.jsx             control for adding a new stage
```

## Notes for the write-up
- Vehicle data lives in `data.js` as a static array -- swap this for an
  API call when you wire up a backend.
- Each vehicle gets its own board state, generated from a template
  based on its current status (`buildDefaultBoard` in `data.js`).
- Board state is in-memory only (resets on refresh) -- add
  localStorage or a backend to persist it.

import { useState } from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'

import Sidebar from './components/Sidebar.jsx'
import WelcomeGreeting from './components/WelcomeGreeting/WelcomeGreeting.jsx'

import Settings from './components/Settings/Settings.jsx'
import Analytics from './pages/Analytics.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Board from './pages/Board.jsx'
import AddVehicle from './pages/AddVehicle.jsx'
import ReportGeneration from './pages/ReportGeneration.jsx'
import Calendar from './pages/Calendar.jsx'

import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import Profile from './pages/Profile/Profile.jsx'

function Layout() {
  const isLoggedIn =
    sessionStorage.getItem('gms_logged_in') === 'true'

  const [showWelcome, setShowWelcome] = useState(
    () =>
      sessionStorage.getItem('gms_welcome_greeting_shown') !== 'true'
  )

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  const finishWelcome = () => {
    sessionStorage.setItem(
      'gms_welcome_greeting_shown',
      'true'
    )
    setShowWelcome(false)
  }

  if (showWelcome) {
    return (
      <WelcomeGreeting
        onFinish={finishWelcome}
      />
    )
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/board/:vehicleId"
          element={<Board />}
        />

        <Route
          path="/add-vehicle"
          element={<AddVehicle />}
        />

        <Route
          path="/report-generation"
          element={<ReportGeneration />}
        />

        <Route
          path="/calendar"
          element={<Calendar />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/welcome"
          element={
            <WelcomeGreeting
              onFinish={() => {}}
            />
          }
        />
      </Route>

      {/* Unknown URL */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}
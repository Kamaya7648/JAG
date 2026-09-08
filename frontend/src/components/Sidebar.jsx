import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from "../context/AppContext.jsx";
import carIcon from '../assets/icons/car.svg'
import reportIcon from '../assets/icons/report.svg'
import calendarIcon from '../assets/icons/calendar.svg'
import addVehicleIcon from '../assets/icons/addvehicle.svg'
import settingsIcon from '../assets/icons/settings-logo.svg'
import garageLogo from '../assets/icons/garage-logo.svg'

const ICONS = {
  car: <img src={carIcon} alt="" />,
  calendar: <img src={calendarIcon} alt="" />,
  report: <img src={reportIcon} alt="" />,
  plus: <img src={addVehicleIcon} alt="" />,
}

const NAV_ITEMS = [
  { icon: 'car', label: 'Assigned Vehicles', to: '/' },
  { icon: 'plus', label: 'Add Vehicle', to: '/add-vehicle' },
  { icon: 'report', label: 'Reports', to: '/report-generation' },
  { icon: 'calendar', label: 'Calendar', to: '/calendar' },
]

export default function Sidebar() {
  const location = useLocation()
  const { user } = useApp()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    sessionStorage.removeItem("gms_logged_in")
    sessionStorage.removeItem("gms_welcome_greeting_shown")
    navigate("/login")
  }

  return (
    <header className="sidebar">
      <div className="sidebar-logo">
        <img src={garageLogo} alt="GarageSync" className="sidebar-logo-mark" />
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = item.to === location.pathname
          return (
            <Link key={item.label} to={item.to} className={`sidebar-item ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">{ICONS[item.icon]}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Link to="/settings" className={`sidebar-settings-btn ${location.pathname === '/settings' ? 'active' : ''}`}>
        <img src={settingsIcon} alt="Settings" />
      </Link>

      <div className="sidebar-profile-wrap">
        <button className="sidebar-profile" onClick={() => setMenuOpen((v) => !v)}>
          <span className="avatar avatar-self">{user.name.charAt(0)}</span>
          <span className="sidebar-profile-name">{user.name}</span>
        </button>

        {menuOpen && (
          <>
            <div className="sidebar-menu-backdrop" onClick={() => setMenuOpen(false)} />
            <div className="sidebar-profile-menu">
              <button onClick={() => { setMenuOpen(false); navigate('/profile'); }}>
                View Profile
              </button>
              <button onClick={handleLogout} className="sidebar-menu-logout">
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
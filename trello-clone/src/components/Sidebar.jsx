import { Link, useLocation } from 'react-router-dom'
import carIcon from '../assets/icons/car.svg'
import reportIcon from '../assets/icons/report.svg'
import calendarIcon from '../assets/icons/calendar.svg'
import addVehicleIcon from '../assets/icons/addvehicle.svg'
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
  { icon: 'calendar', label: 'Calendar' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <header className="sidebar">
      <div className="sidebar-logo">
        <img src={garageLogo} alt="GarageSync" className="sidebar-logo-mark" />
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = item.to === location.pathname
          const content = (
            <>
              <span className="sidebar-icon">{ICONS[item.icon]}</span>
              {item.label}
            </>
          )
          return item.to ? (
            <Link key={item.label} to={item.to} className={`sidebar-item ${isActive ? 'active' : ''}`}>
              {content}
            </Link>
          ) : (
            <div key={item.label} className={`sidebar-item ${isActive ? 'active' : ''}`}>
              {content}
            </div>
          )
        })}
      </nav>
      <button className="sidebar-profile">
        <span className="avatar avatar-self">K</span>
        <span className="sidebar-profile-name">Kamaya</span>
      </button>
    </header>
  )
}

import { Link } from 'react-router-dom'
import carIcon from '../assets/icons/car.svg'
import reportIcon from '../assets/icons/report.svg'
import calendarIcon from '../assets/icons/calendar.svg'
import addVehicleIcon from '../assets/icons/addvehicle.svg'

const ICONS = {
  car: <img src={carIcon} alt="" />,
  calendar: <img src={calendarIcon} alt="" />,
  report: <img src={reportIcon} alt="" />,
  plus: <img src={addVehicleIcon} alt="" />,
}

const NAV_ITEMS = [
  { icon: 'car', label: 'Assigned Vehicles', active: true, to: '/' },
  { icon: 'plus', label: 'Add Vehicle' },
  { icon: 'report', label: 'Report Generation' },
  { icon: 'calendar', label: 'Calendar' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-mark">◆</span> GarageSync
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const content = (
            <>
              <span className="sidebar-icon">{ICONS[item.icon]}</span>
              {item.label}
            </>
          )
          return item.to ? (
            <Link key={item.label} to={item.to} className={`sidebar-item ${item.active ? 'active' : ''}`}>
              {content}
            </Link>
          ) : (
            <div key={item.label} className={`sidebar-item ${item.active ? 'active' : ''}`}>
              {content}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

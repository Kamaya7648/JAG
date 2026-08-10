import "./Sidebar.css";

import { FaSignOutAlt, FaCog } from "react-icons/fa";

import carIcon from "../../assets/icons/car.png";
import reportIcon from "../../assets/icons/report.png";
import calendarIcon from "../../assets/icons/calendar.png";
import addIcon from "../../assets/icons/add-vehicle.png";

function Sidebar({ active, setActive }) {

  const menus = [
    { name: "Assigned Vehicles", icon: carIcon },
    { name: "Add Vehicle", icon: addIcon },
    { name: "Report Generation", icon: reportIcon },
    { name: "Calendar", icon: calendarIcon },
  ];

  return (
    <aside className="sidebar">

      <div className="logo">
        <div className="gear-wrapper">
          <FaCog className="gear gear1" />
          <FaCog className="gear gear2" />
          <FaCog className="gear gear3" />
        </div>

        <div className="logo-text">
          <h2>GMS</h2>
          <p>Garage Management System</p>
        </div>
      </div>

      <div className="divider"></div>

      <nav className="menu">
        {menus.map((item) => (
          <button
            key={item.name}
            className={`menu-item ${active === item.name ? "active" : ""}`}
            onClick={() => setActive(item.name)}
          >
            <span className="icon">
              <img src={item.icon} alt={item.name} />
            </span>
            <span className="menu-text">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="logout">
          <FaSignOutAlt className="icon" />
          <span>Logout</span>
        </button>

        <div className="footer-links">
          <a href="#">About Us</a>
          <a href="#">Contact</a>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;
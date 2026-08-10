import "./Header.css";
import { useState } from "react";
import { FaSearch, FaCog, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useApp } from "../../context/AppContext";

function Header({ onProfileClick, onSettingsClick, showGreeting = true, showSearch = true }) {
  const { user } = useApp();
  const [viewDate, setViewDate] = useState(new Date());
  const [search, setSearch] = useState("");

  const realToday = new Date();
  const isToday = viewDate.toDateString() === realToday.toDateString();

  const hour = realToday.getHours();
  let greeting = "";
  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const dateLabel = viewDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const goPrevDay = () => {
    const d = new Date(viewDate);
    d.setDate(d.getDate() - 1);
    setViewDate(d);
  };

  const goNextDay = () => {
    const d = new Date(viewDate);
    d.setDate(d.getDate() + 1);
    setViewDate(d);
  };

  return (
    <div className="header">
      <div className="top-bar">
        {showSearch ? (
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        ) : (
          <div />
        )}

        <div className="right-side">
          <button className="settings-btn" onClick={onSettingsClick}>
            <FaCog />
          </button>

          <div className="profile" onClick={onProfileClick}>
            <img src={user.image} alt="Supervisor" />
            <div className="profile-info">
              <h4>{user.name}</h4>
              <span>{user.role}</span>
            </div>
          </div>
        </div>
      </div>

      {showGreeting && (
        <div className="welcome-row">
          <div>
            <h2>
              {greeting}, {user.name} 👋
            </h2>
            <p>Here's what's happening in your garage today.</p>
          </div>

          <div className="date-card">
            <span>{isToday ? "Today" : "Viewing"}</span>
            <div className="date-nav">
              <button onClick={goPrevDay}>
                <FaChevronLeft />
              </button>
              <h4>{dateLabel}</h4>
              <button onClick={goNextDay}>
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
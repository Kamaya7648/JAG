import "./Calendar.css";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes, FaPlus, FaTrash } from "react-icons/fa";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function Calendar() {
  const today = new Date();

  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedKey, setSelectedKey] = useState(null);
  const [newEventText, setNewEventText] = useState("");
  const [events, setEvents] = useState({});

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0 || cells.length < 42) {
    cells.push({ day: nextDay, current: false });
    nextDay++;
    if (cells.length >= 42) break;
  }

  const goPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isToday = (day, current) =>
    current &&
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const handleDayClick = (day, current) => {
    if (!current) return;
    const key = formatKey(year, month, day);
    setSelectedKey(key);
    setNewEventText("");
  };

  const handleAddEvent = () => {
    if (!selectedKey || newEventText.trim() === "") return;
    setEvents((prev) => {
      const updated = { ...prev };
      const list = updated[selectedKey] ? [...updated[selectedKey]] : [];
      list.push(newEventText.trim());
      updated[selectedKey] = list;
      return updated;
    });
    setNewEventText("");
  };

  const handleDeleteEvent = (key, index) => {
    setEvents((prev) => {
      const updated = { ...prev };
      const list = [...updated[key]];
      list.splice(index, 1);
      if (list.length === 0) {
        delete updated[key];
      } else {
        updated[key] = list;
      }
      return updated;
    });
  };

  const closePopup = () => {
    setSelectedKey(null);
    setNewEventText("");
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-card">

        <div className="calendar-header">
          <button className="cal-nav-btn" onClick={goPrevMonth}>
            <FaChevronLeft />
          </button>
          <h2>
            {MONTH_NAMES[month]} {year}
          </h2>
          <button className="cal-nav-btn" onClick={goNextMonth}>
            <FaChevronRight />
          </button>
        </div>

        <div className="calendar-weekdays">
          {WEEK_DAYS.map((wd) => (
            <div key={wd} className="weekday-cell">{wd}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {cells.map((cell, idx) => {
            const key = cell.current ? formatKey(year, month, cell.day) : null;
            const dayEvents = key && events[key] ? events[key] : [];
            return (
              <div
                key={idx}
                className={`day-cell ${!cell.current ? "muted" : ""} ${isToday(cell.day, cell.current) ? "today" : ""}`}
                onClick={() => handleDayClick(cell.day, cell.current)}
              >
                <span className="day-number">{cell.day}</span>

                <div className="day-events">
                  {dayEvents.slice(0, 3).map((ev, i) => (
                    <div key={i} className="event-pill" title={ev}>
                      {ev}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="event-more">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedKey && (
        <div className="note-popup-overlay" onClick={closePopup}>
          <div className="note-popup" onClick={(e) => e.stopPropagation()}>
            <div className="note-popup-header">
              <h3>{selectedKey}</h3>
              <button className="close-btn" onClick={closePopup}>
                <FaTimes />
              </button>
            </div>

            <div className="existing-events">
              {(events[selectedKey] || []).length === 0 && (
                <p className="no-events-text">No events yet</p>
              )}
              {(events[selectedKey] || []).map((ev, i) => (
                <div key={i} className="existing-event-row">
                  <span>{ev}</span>
                  <button
                    className="delete-event-btn"
                    onClick={() => handleDeleteEvent(selectedKey, i)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="add-event-row">
              <input
                type="text"
                className="event-input"
                placeholder="Add a meeting / note..."
                value={newEventText}
                onChange={(e) => setNewEventText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddEvent()}
              />
              <button className="add-event-btn" onClick={handleAddEvent}>
                <FaPlus />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Plus, Trash2 } from "lucide-react";
import { STATUS_STYLES } from "../data.js";

const WEEK_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const ROW_HEIGHT = 49; // px — matches .cal-week-cell min-height (48) + border-top (1)
const DURATIONS = [0.5, 1, 1.5, 2, 3, 4, 6, 8];

const EVENT_TYPES = {
  ...STATUS_STYLES,
  Meeting: { bg: "#053858", color: "#75afd6" },
  Other: { bg: "#6b3762", color: "#efe1ee" },
};

function formatKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatHour(h) {
  const period = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12} ${period}`;
}
function layoutDayEvents(dayEvents) {
  const sorted = [...dayEvents].sort((a, b) => a.startHour - b.startHour);
  const clusters = [];
  let current = [];
  let clusterEnd = -Infinity;

  for (const ev of sorted) {
    const start = ev.startHour;
    const end = ev.startHour + ev.duration;
    if (current.length === 0 || start < clusterEnd) {
      current.push(ev);
      clusterEnd = Math.max(clusterEnd, end);
    } else {
      clusters.push(current);
      current = [ev];
      clusterEnd = end;
    }
  }
  if (current.length) clusters.push(current);

  const result = [];
  for (const cluster of clusters) {
    const count = cluster.length;
    cluster.forEach((ev, i) => {
      result.push({ ...ev, col: i, colCount: count });
    });
  }
  return result;
}

function startOfWeek(d) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export default function Calendar() {
  const today = new Date();

  const [miniViewDate, setMiniViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState({});
  const [addingSlot, setAddingSlot] = useState(null);
  const [newText, setNewText] = useState("");
  const [newStatus, setNewStatus] = useState("Meeting");
  const [newDuration, setNewDuration] = useState(1);

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [qaDate, setQaDate] = useState(formatKey(today));
  const [qaHour, setQaHour] = useState(9);
  const [qaDuration, setQaDuration] = useState(1);
  const [qaText, setQaText] = useState("");
  const [qaStatus, setQaStatus] = useState("Meeting");
  const [viewingEvent, setViewingEvent] = useState(null); // { key, event }

  const miniYear = miniViewDate.getFullYear();
  const miniMonth = miniViewDate.getMonth();

  const buildMiniCells = (y, m) => {
    const firstDayIndex = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const daysInPrevMonth = new Date(y, m, 0).getDate();
    const cells = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, current: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
    let nextDay = 1;
    while (cells.length % 7 !== 0 || cells.length < 42) {
      cells.push({ day: nextDay, current: false });
      nextDay++;
      if (cells.length >= 42) break;
    }
    return cells;
  };

  const miniCells = buildMiniCells(miniYear, miniMonth);

  const goPrevMiniMonth = () => setMiniViewDate(new Date(miniYear, miniMonth - 1, 1));
  const goNextMiniMonth = () => setMiniViewDate(new Date(miniYear, miniMonth + 1, 1));

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const pickMiniDay = (day, current) => {
    if (!current) return;
    setSelectedDate(new Date(miniYear, miniMonth, day));
  };

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const goPrevWeek = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 7);
    setSelectedDate(d);
  };
  const goNextWeek = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 7);
    setSelectedDate(d);
  };

  const weekLabel = () => {
    const first = weekDays[0];
    const last = weekDays[6];
    if (first.getMonth() === last.getMonth()) {
      return `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`;
    }
    return `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${MONTH_NAMES[last.getMonth()]} ${last.getDate()}, ${last.getFullYear()}`;
  };

  const addEvent = (key, { hour, duration, text, status }) => {
    if (!text || text.trim() === "") return;
    setEvents((prev) => {
      const updated = { ...prev };
      const list = updated[key] ? [...updated[key]] : [];
      list.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, startHour: hour, duration, text: text.trim(), status });
      updated[key] = list;
      return updated;
    });
  };

  const openAddForm = (key, hour) => {
    setAddingSlot({ key, hour });
    setNewText("");
    setNewStatus("Meeting");
    setNewDuration(1);
  };

  const handleAddEvent = () => {
    if (!addingSlot) return;
    addEvent(addingSlot.key, { hour: addingSlot.hour, duration: newDuration, text: newText, status: newStatus });
    setAddingSlot(null);
    setNewText("");
  };

  const handleDeleteEvent = (key, id) => {
    setEvents((prev) => {
      const updated = { ...prev };
      const list = updated[key].filter((e) => e.id !== id);
      if (list.length === 0) delete updated[key];
      else updated[key] = list;
      return updated;
    });
  };

  const openQuickAdd = () => {
    setQaDate(formatKey(selectedDate));
    setQaHour(9);
    setQaDuration(1);
    setQaText("");
    setQaStatus("Meeting");
    setQuickAddOpen(true);
  };

  const handleQuickAdd = () => {
    if (qaText.trim() === "") return;
    addEvent(qaDate, { hour: Number(qaHour), duration: Number(qaDuration), text: qaText, status: qaStatus });
    const [y, m, d] = qaDate.split("-").map(Number);
    setSelectedDate(new Date(y, m - 1, d));
    setQuickAddOpen(false);
  };

  return (
    <main className="main-panel">
      <div className="topbar-dash">
        <h1>Calendar</h1>
      </div>

      <div className="cal-layout">
        <aside className="cal-mini-col">
          <div className="cal-mini">
            <div className="cal-mini-header">
              <button className="cal-nav-btn" onClick={goPrevMiniMonth}><ChevronLeft size={14} /></button>
              <span>{MONTH_NAMES[miniMonth]} {miniYear}</span>
              <button className="cal-nav-btn" onClick={goNextMiniMonth}><ChevronRight size={14} /></button>
            </div>
            <div className="cal-mini-weekdays">
              {WEEK_LETTERS.map((w, i) => <span key={i}>{w}</span>)}
            </div>
            <div className="cal-mini-grid">
              {miniCells.map((cell, idx) => {
                const cellDate = cell.current ? new Date(miniYear, miniMonth, cell.day) : null;
                const key = cellDate ? formatKey(cellDate) : null;
                const hasEvents = key && events[key] && events[key].length > 0;
                const isToday = cellDate && isSameDay(cellDate, today);
                const isSelected = cellDate && isSameDay(cellDate, selectedDate);
                return (
                  <button
                    key={idx}
                    className={`cal-mini-cell ${!cell.current ? "muted" : ""} ${isToday ? "today" : ""} ${hasEvents ? "has-events" : ""} ${isSelected ? "selected" : ""}`}
                    onClick={() => pickMiniDay(cell.day, cell.current)}
                    disabled={!cell.current}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
          </div>

          <button className="cal-quickadd-btn" onClick={openQuickAdd} title="New Event">
              <Plus size={22} />
          </button>
        </aside>

        <div className="cal-week-col">
          <div className="table-card cal-card cal-week-card">
            <div className="cal-header">
              <button className="cal-nav-btn" onClick={goPrevWeek}><ChevronLeft size={16} /></button>
              <h2>{weekLabel()}</h2>
              <button className="cal-nav-btn" onClick={goNextWeek}><ChevronRight size={16} /></button>
            </div>

            <div className="cal-week-grid">
              <div className="cal-week-corner" />
              {weekDays.map((d) => (
                <div key={formatKey(d)} className={`cal-week-daycol-header ${isSameDay(d, today) ? "today" : ""}`}>
                  <div className="cal-week-daycol-name">{DAY_SHORT[d.getDay()]}</div>
                  <div className="cal-week-daycol-num">{d.getDate()}</div>
                </div>
              ))}

              {HOURS.map((h) => (
                <>
                  <div key={`h-${h}`} className="cal-week-hour-label">{formatHour(h)}</div>
                  {weekDays.map((d) => {
                    const key = formatKey(d);
                    const dayEvents = events[key] || [];
                    const dayLayout = layoutDayEvents(dayEvents);
                    const startEvents = dayLayout.filter((e) => e.startHour === h);
                    const isAdding = addingSlot && addingSlot.key === key && addingSlot.hour === h;
                    return (
                      <div
                        key={`${key}-${h}`}
                        className="cal-week-cell"
                        onClick={() => !isAdding && openAddForm(key, h)}
                        onContextMenu={(e) => { e.preventDefault(); openAddForm(key, h); }}
                      >
                      {startEvents.map((ev) => {
  const style = EVENT_TYPES[ev.status] || EVENT_TYPES.Other;
  const height = ev.duration * ROW_HEIGHT - 3;
  const widthPct = 100 / ev.colCount;
  return (
    <div
      key={ev.id}
      className="cal-event-block"
      style={{
        background: style.bg,
        color: style.color,
        borderLeftColor: style.color,
        height: `${height}px`,
        width: `calc(${widthPct}% - 2px)`,
        left: `${ev.col * widthPct}%`,
      }}
      title={`${ev.text} · ${formatHour(h)} · ${ev.duration}h`}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => { e.stopPropagation(); setViewingEvent({ key, event: ev }); }}
    >
      <span>{ev.text}</span>
      <button
        className="cal-delete-event-btn"
        onClick={(e) => { e.stopPropagation(); handleDeleteEvent(key, ev.id); }}
      >
        <Trash2 size={10} />
      </button>
    </div>
  );
})}

                        {isAdding && (
                          <div className="cal-week-add-form" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              className="cal-event-input"
                              placeholder="Title..."
                              value={newText}
                              onChange={(e) => setNewText(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleAddEvent()}
                              autoFocus
                            />
                            <select
                              className="cal-status-select"
                              value={newDuration}
                              onChange={(e) => setNewDuration(Number(e.target.value))}
                            >
                              {DURATIONS.map((du) => (
                                <option key={du} value={du}>{du} hr{du !== 1 ? "s" : ""}</option>
                              ))}
                            </select>
                            <select
                              className="cal-status-select"
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                            >
                              {Object.keys(EVENT_TYPES).map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <div className="cal-week-add-actions">
                              <button className="cal-add-event-btn" onClick={handleAddEvent}>
                                <Plus size={13} />
                              </button>
                              <button className="cal-close-btn" onClick={() => setAddingSlot(null)}>
                                <X size={13} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>

      {quickAddOpen && (
        <div className="cal-quickadd-overlay" onClick={() => setQuickAddOpen(false)}>
          <div className="cal-quickadd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cal-quickadd-header">
              <h3>New Event</h3>
              <button className="cal-close-btn" onClick={() => setQuickAddOpen(false)}><X size={14} /></button>
            </div>

            <div className="cal-quickadd-field">
              <label>Title</label>
              <input
                type="text"
                className="cal-event-input"
                placeholder="Event title..."
                value={qaText}
                onChange={(e) => setQaText(e.target.value)}
                autoFocus
              />
            </div>

            <div className="cal-quickadd-field">
              <label>Date</label>
              <input
                type="date"
                className="cal-event-input"
                value={qaDate}
                onChange={(e) => setQaDate(e.target.value)}
              />
            </div>

            <div className="cal-quickadd-row">
              <div className="cal-quickadd-field">
                <label>Start time</label>
                <select className="cal-status-select" value={qaHour} onChange={(e) => setQaHour(e.target.value)}>
                  {HOURS.map((h) => (
                    <option key={h} value={h}>{formatHour(h)}</option>
                  ))}
                </select>
              </div>
              <div className="cal-quickadd-field">
                <label>Duration</label>
                <select className="cal-status-select" value={qaDuration} onChange={(e) => setQaDuration(e.target.value)}>
                  {DURATIONS.map((du) => (
                    <option key={du} value={du}>{du} hr{du !== 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="cal-quickadd-field">
              <label>Category</label>
              <select className="cal-status-select" value={qaStatus} onChange={(e) => setQaStatus(e.target.value)}>
                {Object.keys(EVENT_TYPES).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="cal-quickadd-actions">
              <button className="cal-close-btn" onClick={() => setQuickAddOpen(false)}>Cancel</button>
              <button className="cal-add-event-btn cal-add-event-btn-wide" onClick={handleQuickAdd}>
                <Plus size={14} /> Add Event
              </button>
            </div>
          </div>
        </div>
      )}
      {viewingEvent && (() => {
  const style = EVENT_TYPES[viewingEvent.event.status] || EVENT_TYPES.Other;
  const ev = viewingEvent.event;
  const [y, m, d] = viewingEvent.key.split("-").map(Number);
  const dateLabel = new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const endHour = ev.startHour + ev.duration;
  return (
    <div className="cal-quickadd-overlay" onClick={() => setViewingEvent(null)}>
      <div className="cal-quickadd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cal-quickadd-header">
          <h3>Event Details</h3>
          <button className="cal-close-btn" onClick={() => setViewingEvent(null)}><X size={14} /></button>
        </div>

        <div
          className="cal-view-badge"
          style={{ background: style.bg, color: style.color, borderLeftColor: style.color }}
        >
          {ev.status}
        </div>

        <div className="cal-quickadd-field">
          <label>Title</label>
          <div className="cal-view-text">{ev.text}</div>
        </div>

        <div className="cal-quickadd-field">
          <label>Date</label>
          <div className="cal-view-text">{dateLabel}</div>
        </div>

        <div className="cal-quickadd-field">
          <label>Time</label>
          <div className="cal-view-text">
            {formatHour(ev.startHour)} – {formatHour(endHour % 24)} ({ev.duration} hr{ev.duration !== 1 ? "s" : ""})
          </div>
        </div>

        <div className="cal-quickadd-actions">
          <button
            className="cal-close-btn cal-view-delete"
            onClick={() => { handleDeleteEvent(viewingEvent.key, ev.id); setViewingEvent(null); }}
          >
            <Trash2 size={14} /> Delete
          </button>
          <button className="cal-add-event-btn cal-add-event-btn-wide" onClick={() => setViewingEvent(null)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
})()}
    </main>
  );
}
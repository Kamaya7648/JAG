import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Kanban, FileText,
  UserCircle, Settings, LogOut, Bell, ChevronDown, Camera, Mail,
  Phone, Calendar, Building2, CreditCard, Star, Car, Clock,
  Search, Download, Edit3,
} from 'lucide-react';
import './profile.css';
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Kanban Board', icon: Kanban },
  { label: 'Reports', icon: FileText },
  { label: 'Profile', icon: UserCircle, active: true },
];

const TABLE_COLUMNS = [
  'Vehicle', 'Customer', 'Date', 'Work Type', 'Completion Time', 'Rating', 'Status',
];

const Profile = () => {
  const navigate = useNavigate();
  const [onDuty, setOnDuty] = useState(true);

  return (
    <div className="profile-screen">
      {/* Sidebar */}
      <aside className="profile-sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark"><span className="brand-mark__dot" /></span>
          <div>
            <h3>GMS</h3>
            <p>Garage Management System</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              className={`sidebar-nav__item ${active ? 'is-active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button type="button" className="sidebar-nav__item">
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <button type="button" className="sidebar-nav__item" onClick={() => navigate('/login')}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="profile-main">
        <header className="profile-topbar">
          <h1>Supervisor Profile</h1>

          <div className="topbar-actions">
            <button type="button" className="icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="icon-btn__badge" />
            </button>
            <button type="button" className="topbar-user">
              <span className="topbar-user__avatar" />
              <span className="topbar-user__name">&nbsp;</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        <div className="profile-content">
          <div className="profile-layout">
            {/* Left: identity card */}
            <aside className="identity-card">
              <div className="identity-photo">
                <div className="identity-photo__ring">
                  <UserCircle size={44} />
                </div>
                <button type="button" className="identity-photo__edit" aria-label="Change photo">
                  <Camera size={13} />
                </button>
              </div>

              <h2 className="identity-name">&nbsp;</h2>
              <span className="identity-role">Supervisor</span>

              <ul className="identity-list">
                <li><CreditCard size={15} /><span className="identity-list__label">ID</span><span className="identity-list__value">—</span></li>
                <li><Building2 size={15} /><span className="identity-list__label">Department</span><span className="identity-list__value">—</span></li>
                <li><Mail size={15} /><span className="identity-list__label">Email</span><span className="identity-list__value">—</span></li>
                <li><Phone size={15} /><span className="identity-list__label">Phone</span><span className="identity-list__value">—</span></li>
                <li><Calendar size={15} /><span className="identity-list__label">Joined</span><span className="identity-list__value">—</span></li>
              </ul>

              <button type="button" className="btn btn--outline">
                <Edit3 size={15} />
                Edit Profile
              </button>
            </aside>

            {/* Right column */}
            <div className="profile-right">
              {/* Top info row */}
              <section className="info-row">
                <div className="mini-card">
                  <span className="mini-card__label">Employee ID</span>
                  <span className="mini-card__value">—</span>
                </div>
                <div className="mini-card">
                  <span className="mini-card__label">Current Shift</span>
                  <span className="mini-card__value">—</span>
                  <span className="mini-card__sub">—</span>
                </div>
                <div className="mini-card">
                  <span className="mini-card__label">Status</span>
                  <span className={`mini-card__value ${onDuty ? 'text-success' : 'text-muted'}`}>
                    {onDuty ? 'On-Duty' : 'Off-Duty'}
                  </span>
                  <span className="mini-card__sub">Receiving alerts</span>
                </div>

                <div className="status-note">
                  <p>You will receive work alerts and notifications while On-Duty.</p>
                  <button
                    type="button"
                    className={`toggle ${onDuty ? 'is-on' : ''}`}
                    onClick={() => setOnDuty((v) => !v)}
                    aria-pressed={onDuty}
                    aria-label="Toggle on-duty status"
                  >
                    <span className="toggle__knob" />
                  </button>
                </div>
              </section>

              {/* Performance overview */}
              <section className="panel">
                <h3 className="panel__title">Performance Overview (Today)</h3>
                <div className="performance-row">
                  <div className="perf-card">
                    <span className="perf-card__icon perf-card__icon--green"><Star size={18} /></span>
                    <div>
                      <span className="perf-card__label">Customer Rating (CSAT)</span>
                      <span className="perf-card__value">— / 5</span>
                      <span className="perf-card__sub">— from yesterday</span>
                    </div>
                  </div>
                  <div className="perf-card">
                    <span className="perf-card__icon perf-card__icon--blue"><Car size={18} /></span>
                    <div>
                      <span className="perf-card__label">Completed Cars</span>
                      <span className="perf-card__value">—</span>
                      <span className="perf-card__sub">— from yesterday</span>
                    </div>
                  </div>
                  <div className="perf-card">
                    <span className="perf-card__icon perf-card__icon--orange"><Clock size={18} /></span>
                    <div>
                      <span className="perf-card__label">Average Repair Time</span>
                      <span className="perf-card__value">—</span>
                      <span className="perf-card__sub">— from yesterday</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Past work history */}
              <section className="panel">
                <div className="panel__header">
                  <h3 className="panel__title">Past Work History</h3>

                  <div className="panel__tools">
                    <button type="button" className="tool-btn">
                      <Calendar size={15} />
                      Date range
                      <ChevronDown size={14} />
                    </button>
                    <div className="search-box">
                      <Search size={15} />
                      <input type="text" placeholder="Search vehicle or customer" />
                    </div>
                    <button type="button" className="btn btn--ghost btn--sm">
                      <Download size={14} />
                      Export
                    </button>
                  </div>
                </div>

                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {TABLE_COLUMNS.map((col) => <th key={col}>{col}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={TABLE_COLUMNS.length} className="data-table__empty">
                          No work history yet
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

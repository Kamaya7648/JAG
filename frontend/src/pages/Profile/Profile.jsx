import { useState } from 'react';
import {
  UserCircle, Camera, Mail,
  Phone, Calendar, Building2, CreditCard, Star, Car, Clock,
  Search, Download, Edit3, ChevronDown,
} from 'lucide-react';
import './profile.css';
import { useApp } from '../../context/AppContext';

const Profile = () => {
  const { user } = useApp();
  const [onDuty, setOnDuty] = useState(true);

  const formatJoinedDate = (date) => {
    if (!date) return '—';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '—';
    }

    return parsedDate.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <main className="profile-main">
      <header className="profile-topbar">
        <h1>Supervisor Profile</h1>
      </header>

      <div className="profile-content">
        <div className="profile-layout">
          {/* Left: identity card */}
          <aside className="identity-card">
            <div className="identity-photo">
              <div className="identity-photo__ring">
                {user?.profilePhoto || user?.image ? (
                  <img
                    src={user.profilePhoto || user.image}
                    alt={user.name || 'Profile'}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <UserCircle size={44} />
                )}
              </div>

              <button
                type="button"
                className="identity-photo__edit"
                aria-label="Change photo"
              >
                <Camera size={13} />
              </button>
            </div>

            <h2 className="identity-name">
              {user?.name || '—'}
            </h2>

            <span className="identity-role">
              {user?.role || 'Supervisor'}
            </span>

            <ul className="identity-list">
              <li>
                <CreditCard size={15} />
                <span className="identity-list__label">ID</span>
                <span className="identity-list__value">
                  {user?.employeeId || '—'}
                </span>
              </li>

              <li>
                <Building2 size={15} />
                <span className="identity-list__label">Department</span>
                <span className="identity-list__value">
                  {user?.department || '—'}
                </span>
              </li>

              <li>
                <Mail size={15} />
                <span className="identity-list__label">Email</span>
                <span className="identity-list__value">
                  {user?.email || '—'}
                </span>
              </li>

              <li>
                <Phone size={15} />
                <span className="identity-list__label">Phone</span>
                <span className="identity-list__value">
                  {user?.phone || '—'}
                </span>
              </li>

              <li>
                <Calendar size={15} />
                <span className="identity-list__label">Joined</span>
                <span className="identity-list__value">
                  {formatJoinedDate(user?.createdAt)}
                </span>
              </li>
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
                <span className="mini-card__value">
                  {user?.employeeId || '—'}
                </span>
              </div>

              <div className="mini-card">
                <span className="mini-card__label">Current Shift</span>
                <span className="mini-card__value">—</span>
                <span className="mini-card__sub">—</span>
              </div>

              <div className="mini-card">
                <span className="mini-card__label">Status</span>
                <span
                  className={`mini-card__value ${
                    onDuty ? 'text-success' : 'text-muted'
                  }`}
                >
                  {onDuty ? 'On-Duty' : 'Off-Duty'}
                </span>
                <span className="mini-card__sub">
                  Receiving alerts
                </span>
              </div>

              <div className="status-note">
                <p>
                  You will receive work alerts and notifications while On-Duty.
                </p>

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
              <h3 className="panel__title">
                Performance Overview (Today)
              </h3>

              <div className="performance-row">
                <div className="perf-card">
                  <span className="perf-card__icon perf-card__icon--green">
                    <Star size={18} />
                  </span>

                  <div>
                    <span className="perf-card__label">
                      Customer Rating (CSAT)
                    </span>
                    <span className="perf-card__value">
                      — / 5
                    </span>
                    <span className="perf-card__sub">
                      — from yesterday
                    </span>
                  </div>
                </div>

                <div className="perf-card">
                  <span className="perf-card__icon perf-card__icon--blue">
                    <Car size={18} />
                  </span>

                  <div>
                    <span className="perf-card__label">
                      Completed Cars
                    </span>
                    <span className="perf-card__value">
                      —
                    </span>
                    <span className="perf-card__sub">
                      — from yesterday
                    </span>
                  </div>
                </div>

                <div className="perf-card">
                  <span className="perf-card__icon perf-card__icon--orange">
                    <Clock size={18} />
                  </span>

                  <div>
                    <span className="perf-card__label">
                      Average Repair Time
                    </span>
                    <span className="perf-card__value">
                      —
                    </span>
                    <span className="perf-card__sub">
                      — from yesterday
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Past work history */}
            <section className="profile-history-card">
              <div className="profile-history-head">
                <h3>Past Work History</h3>

                <div className="panel__tools">
                  <button type="button" className="tool-btn">
                    <Calendar size={15} />
                    Date range
                    <ChevronDown size={14} />
                  </button>

                  <div className="search-box">
                    <Search size={15} />
                    <input
                      type="text"
                      placeholder="Search vehicle or customer"
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                  >
                    <Download size={14} />
                    Export
                  </button>
                </div>
              </div>

              <div className="profile-history-table-box">
                <div className="table-scroll">
                  <table className="vehicle-table">
                    <thead>
                      <tr>
                        <th>
                          <span className="th-label">Vehicle</span>
                        </th>
                        <th>
                          <span className="th-label">Customer</span>
                        </th>
                        <th>
                          <span className="th-label">Date</span>
                        </th>
                        <th>
                          <span className="th-label">Work Type</span>
                        </th>
                        <th>
                          <span className="th-label">
                            Completion Time
                          </span>
                        </th>
                        <th>
                          <span className="th-label">Rating</span>
                        </th>
                        <th>
                          <span className="th-label">Status</span>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td colSpan={7} className="empty-state">
                          No work history yet
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
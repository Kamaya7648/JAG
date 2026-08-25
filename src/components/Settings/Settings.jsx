import "./Settings.css";
import { useState } from "react";
import {
  FaBuilding,
  FaBell,
  FaMoon,
  FaLock,
  FaSlidersH,
  FaHistory,
} from "react-icons/fa";
import { useApp } from "../../context/AppContext";

function Settings() {
  const { settings, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const [draft, setDraft] = useState({
    garageName: settings.garageName,
    address: settings.address,
    phone: settings.phone,
    currency: settings.currency,
    dateFormat: settings.dateFormat,
    timeFormat: settings.timeFormat,
    timezone: settings.timezone,
    language: settings.language,
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleDraftChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateSettings(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { key: "general", label: "General" },
    { key: "preferences", label: "Preferences" },
    { key: "notifications", label: "Notifications" },
    { key: "appearance", label: "Appearance" },
    { key: "security", label: "Security" },
  ];

  return (
    <main className="main-panel">
    <div className="settings-page">

      <div className="settings-header">
        <h2>Settings</h2>
        <p>Manage your system preferences.</p>
      </div>

      <div className="settings-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`settings-tab ${activeTab === t.key ? "active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="settings-body">

        {/* ============ GENERAL ============ */}
        {activeTab === "general" && (
          <div className="settings-panel">

            <div className="settings-card">
              <div className="settings-card-title">
                <FaBuilding /> General Settings
              </div>

              <label>Garage Name</label>
              <input
                type="text"
                value={draft.garageName}
                onChange={(e) => handleDraftChange("garageName", e.target.value)}
              />

              <label>Address</label>
              <textarea
                rows="2"
                value={draft.address}
                onChange={(e) => handleDraftChange("address", e.target.value)}
              />

              <label>Phone Number</label>
              <input
                type="text"
                value={draft.phone}
                onChange={(e) => handleDraftChange("phone", e.target.value)}
              />

              <div className="settings-row-2">
                <div>
                  <label>Currency</label>
                  <select
                    value={draft.currency}
                    onChange={(e) => handleDraftChange("currency", e.target.value)}
                  >
                    <option value="LKR">Sri Lankan Rupee (Rs.)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>

                <div>
                  <label>Timezone</label>
                  <select
                    value={draft.timezone}
                    onChange={(e) => handleDraftChange("timezone", e.target.value)}
                  >
                    <option value="Colombo">(UTC+05:30) Colombo</option>
                    <option value="London">(UTC+00:00) London</option>
                    <option value="Dubai">(UTC+04:00) Dubai</option>
                  </select>
                </div>
              </div>

              <div className="settings-row-2">
                <div>
                  <label>Date Format</label>
                  <select
                    value={draft.dateFormat}
                    onChange={(e) => handleDraftChange("dateFormat", e.target.value)}
                  >
                    <option value="DD MMM YYYY">DD MMM YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label>Time Format</label>
                  <select
                    value={draft.timeFormat}
                    onChange={(e) => handleDraftChange("timeFormat", e.target.value)}
                  >
                    <option value="12">12 Hour (AM/PM)</option>
                    <option value="24">24 Hour</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="settings-card">
              <div className="settings-card-title">
                <FaBell /> Quick Toggles
              </div>

              <ToggleRow
                label="Email notifications"
                checked={settings.emailNotifications}
                onChange={(v) => updateSettings({ emailNotifications: v })}
              />
              <ToggleRow
                label="Auto backup"
                checked={settings.autoBackup}
                onChange={(v) => updateSettings({ autoBackup: v })}
              />
              <ToggleRow
                label="Low stock alert"
                checked={settings.lowStockAlert}
                onChange={(v) => updateSettings({ lowStockAlert: v })}
              />
              <ToggleRow
                label="Job completion alert"
                checked={settings.jobCompletionAlert}
                onChange={(v) => updateSettings({ jobCompletionAlert: v })}
              />
              <ToggleRow
                label="Dark mode"
                checked={settings.darkMode}
                onChange={(v) => updateSettings({ darkMode: v })}
              />
            </div>

          </div>
        )}

        {/* ============ PREFERENCES ============ */}
        {activeTab === "preferences" && (
          <div className="settings-panel single">
            <div className="settings-card">
              <div className="settings-card-title">
                <FaSlidersH /> Preferences
              </div>

              <label>Vehicles per page</label>
              <select
                value={settings.vehiclesPerPage || "10"}
                onChange={(e) => updateSettings({ vehiclesPerPage: e.target.value })}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>

              <label>Default landing page</label>
              <select
                value={settings.defaultView || "Assigned Vehicles"}
                onChange={(e) => updateSettings({ defaultView: e.target.value })}
              >
                <option value="Assigned Vehicles">Assigned Vehicles</option>
                <option value="Report Generation">Report Generation</option>
                <option value="Calendar">Calendar</option>
              </select>

              <ToggleRow
                label="Compact sidebar"
                checked={settings.compactSidebar || false}
                onChange={(v) => updateSettings({ compactSidebar: v })}
              />
            </div>
          </div>
        )}

        {/* ============ NOTIFICATIONS ============ */}
        {activeTab === "notifications" && (
          <div className="settings-panel single">
            <div className="settings-card">
              <div className="settings-card-title">
                <FaBell /> Notification Preferences
              </div>

              <ToggleRow
                label="Email notifications"
                checked={settings.emailNotifications}
                onChange={(v) => updateSettings({ emailNotifications: v })}
              />
              <ToggleRow
                label="Low stock alert"
                checked={settings.lowStockAlert}
                onChange={(v) => updateSettings({ lowStockAlert: v })}
              />
              <ToggleRow
                label="Job completion alert"
                checked={settings.jobCompletionAlert}
                onChange={(v) => updateSettings({ jobCompletionAlert: v })}
              />
            </div>
          </div>
        )}

        {/* ============ APPEARANCE ============ */}
        {activeTab === "appearance" && (
          <div className="settings-panel single">
            <div className="settings-card">
              <div className="settings-card-title">
                <FaMoon /> Appearance
              </div>

              <ToggleRow
                label="Dark mode"
                checked={settings.darkMode}
                onChange={(v) => updateSettings({ darkMode: v })}
              />

              <label>Language</label>
              <select
                value={draft.language}
                onChange={(e) => handleDraftChange("language", e.target.value)}
              >
                <option value="English">English (US)</option>
                <option value="Sinhala">Sinhala</option>
              </select>
            </div>
          </div>
        )}

        {/* ============ SECURITY ============ */}
        {activeTab === "security" && (
          <div className="settings-panel">

            <div className="settings-card">
              <div className="settings-card-title">
                <FaLock /> Change Password
              </div>

              <label>Current Password</label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => handlePasswordChange("current", e.target.value)}
                placeholder="Enter current password"
              />

              <label>New Password</label>
              <input
                type="password"
                value={passwordForm.newPass}
                onChange={(e) => handlePasswordChange("newPass", e.target.value)}
                placeholder="Enter new password"
              />

              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                placeholder="Re-enter new password"
              />

              <p className="settings-hint" style={{ marginTop: "12px" }}>
                Password will be updated once account authentication is connected to a backend.
              </p>
            </div>

            <div className="settings-card">
              <div className="settings-card-title">
                <FaHistory /> Login Activity
              </div>

              <div className="login-activity-row">
                <span>Last login</span>
                <strong>Today, {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong>
              </div>

              <div className="login-activity-row">
                <span>Device</span>
                <strong>This browser</strong>
              </div>

              <div className="login-activity-row">
                <span>Status</span>
                <strong className="status-active">Active session</strong>
              </div>
            </div>

          </div>
        )}

      </div>

      <div className="settings-footer">
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
        {saved && <span className="saved-msg">Saved ✓</span>}
      </div>
      
    </div>
    </main>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="toggle-row">
      <span>{label}</span>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="slider"></span>
      </label>
    </div>
  );
}

export default Settings;

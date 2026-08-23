import "./Dashboard.css";
import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import ProfileModal from "../../components/ProfileModal/ProfileModal";
import Settings from "../../components/Settings/Settings";
import Calendar from "../../components/Calendar/Calendar";
import WelcomeGreeting from "../../components/WelcomeGreeting/WelcomeGreeting";
import AddVehicle from "../../components/AddVehicle/AddVehicle";
import ReportGeneration from "../ReportGeneration/ReportGeneration";
import Profile from "../supervisor/Profile";
import { useApp } from "../../context/AppContext";

const SESSION_KEY = "gms_welcome_greeting_shown";

function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("Assigned Vehicles");
  const [showProfile, setShowProfile] = useState(false);
  const [greetingActive, setGreetingActive] = useState(() => !sessionStorage.getItem(SESSION_KEY));
  const { settings } = useApp();

  if (greetingActive) {
    return <WelcomeGreeting onFinish={() => { sessionStorage.setItem(SESSION_KEY, "true"); setGreetingActive(false); }} />;
  }

  return (
    <div className={`dashboard ${settings.darkMode ? "dark-mode" : ""}`}>
      <Sidebar active={activeMenu} setActive={setActiveMenu} />
      <main className="dashboard-content">
        <Header onProfileClick={() => setShowProfile(true)} onSettingsClick={() => setActiveMenu("Settings")} showGreeting={false} showSearch={activeMenu === "Assigned Vehicles" || activeMenu === "Settings"} />

        {activeMenu === "Assigned Vehicles" && (
          <></>
        )}

        {activeMenu === "Add Vehicle" && (
          <AddVehicle onCancel={() => setActiveMenu("Assigned Vehicles")} />
        )}

        {activeMenu === "Report Generation" && (
          <ReportGeneration />
        )}

        {activeMenu === "Calendar" && (
          <Calendar />
        )}

        {activeMenu === "Profile" && (
          <Profile />
        )}

        {activeMenu === "Settings" && (
          <Settings />
        )}
      </main>

      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}

export default Dashboard;
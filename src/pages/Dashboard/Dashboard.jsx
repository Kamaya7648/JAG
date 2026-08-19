import "./Dashboard.css";
import { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import ProfileModal from "../../components/ProfileModal/ProfileModal";
import Settings from "../../components/Settings/Settings";
import Calendar from "../../components/Calendar/Calendar";
import WelcomeGreeting from "../../components/WelcomeGreeting/WelcomeGreeting";
import AddVehicle from "../../components/AddVehicle/AddVehicle";

import { useApp } from "../../context/AppContext";

const SESSION_KEY = "gms_welcome_greeting_shown";

function Dashboard() {

  const [activeMenu, setActiveMenu] = useState("Assigned Vehicles");
  const [showProfile, setShowProfile] = useState(false);
  const [greetingActive, setGreetingActive] = useState(
    () => !sessionStorage.getItem(SESSION_KEY)
  );

  const { settings } = useApp();

  if (greetingActive) {
    return <WelcomeGreeting onFinish={() => setGreetingActive(false)} />;
  }

  return (
    <div
      className={`dashboard ${
        settings.darkMode ? "dark-mode" : ""
      }`}
    >

      {/* ================= SIDEBAR ================= */}

      <Sidebar
        active={activeMenu}
        setActive={setActiveMenu}
      />


      {/* ================= MAIN CONTENT ================= */}

      <main className="dashboard-content">

        {/* HEADER */}

        <Header
          onProfileClick={() => setShowProfile(true)}

          onSettingsClick={() =>
            setActiveMenu("Settings")
          }

          showGreeting={false}

          showSearch={
            activeMenu === "Assigned Vehicles" ||
            activeMenu === "Settings"
          }
        />


        {/* ================= ASSIGNED VEHICLES ================= */}

        {activeMenu === "Assigned Vehicles" && (
          <>
            {/* 
              Assigned Vehicles content
              will be added here later
            */}
          </>
        )}


        {/* ================= ADD VEHICLE ================= */}

        {activeMenu === "Add Vehicle" && (
          <AddVehicle
            onCancel={() =>
              setActiveMenu("Assigned Vehicles")
            }
          />
        )}


        {/* ================= CALENDAR ================= */}

        {activeMenu === "Calendar" && (
          <Calendar />
        )}


        {/* ================= SETTINGS ================= */}

        {activeMenu === "Settings" && (
          <Settings />
        )}

      </main>


      {/* ================= PROFILE MODAL ================= */}

      {showProfile && (
        <ProfileModal
          onClose={() => setShowProfile(false)}
        />
      )}

    </div>
  );
}

export default Dashboard;
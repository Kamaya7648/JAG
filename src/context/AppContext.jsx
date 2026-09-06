import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

const DEFAULT_USER = {
  name: "Alex Carter",
  role: "Garage Supervisor",
  image: "https://randomuser.me/api/portraits/men/32.jpg",
};

const DEFAULT_SETTINGS = {
  garageName: "AutoCare Garage",
  address: "123, Main Road, Colombo, Sri Lanka",
  phone: "+94 77 123 4567",
  currency: "LKR",
  dateFormat: "DD MMM YYYY",
  timeFormat: "12",
  timezone: "Colombo",
  language: "English",

  emailNotifications: true,
  autoBackup: true,
  lowStockAlert: true,
  jobCompletionAlert: true,
  darkMode: false,

  vehiclesPerPage: "10",
  defaultView: "Assigned Vehicles",
  compactSidebar: false,
};

function loadStoredUser() {
  try {
    const stored = sessionStorage.getItem("gms_user");
    if (!stored) return DEFAULT_USER;

    const parsed = JSON.parse(stored);

    return {
      name: parsed.name || DEFAULT_USER.name,
      role: parsed.role || DEFAULT_USER.role,
      image: parsed.image || DEFAULT_USER.image,
    };
  } catch {
    return DEFAULT_USER;
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  const [vehicles, setVehicles] = useState([]);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch("http://localhost:5000/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings((prev) => ({ ...prev, ...data })))
      .catch(() => {
        // keep defaults if the backend isn't reachable
      });
  }, []);

  const updateSettings = (patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));

    fetch("http://localhost:5000/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).catch(() => {
      // change still applies locally even if the save request fails
    });
  };

  return (
    <AppContext.Provider
      value={{ user, setUser, vehicles, setVehicles, settings, updateSettings }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
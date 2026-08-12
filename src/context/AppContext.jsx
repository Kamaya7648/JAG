import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    name: "Alex Carter",
    role: "Garage Supervisor",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  });

  const [vehicles, setVehicles] = useState([]);

  const [settings, setSettings] = useState({
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
  });

  const updateSettings = (patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
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
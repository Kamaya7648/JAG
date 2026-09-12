/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();
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

function normalizeUser(parsed) {
  if (!parsed) return null;

  return {
    ...parsed,
    name: parsed.name || "",
    role: parsed.role || "Garage Supervisor",
    image: parsed.image || parsed.profilePhoto || "",
  };
}

function loadStoredUser() {
  try {
    const stored = sessionStorage.getItem("gms_user");

    if (!stored) return null;

    return normalizeUser(JSON.parse(stored));
  } catch {
    return null;
  }
}

function loadStoredToken() {
  try {
    return sessionStorage.getItem("gms_token") || "";
  } catch {
    return "";
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);
  const [token, setToken] = useState(loadStoredToken);
  const [vehicles, setVehicles] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch("http://localhost:5000/api/settings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Authentication failed");
        }

        return res.json();
      })
      .then((data) => {
        setSettings((prev) => ({
          ...prev,
          ...data,
        }));
      })
      .catch(() => {});
  }, [token]);

  const updateSettings = (patch) => {
    setSettings((prev) => ({
      ...prev,
      ...patch,
    }));

    if (!token) return;

    fetch("http://localhost:5000/api/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(patch),
    }).catch(() => {});
  };

  const login = (userData, userToken) => {
    const normalizedUser = normalizeUser(userData);

    setUser(normalizedUser);
    setToken(userToken);
    setVehicles([]);
    setSettings(DEFAULT_SETTINGS);

    sessionStorage.setItem(
      "gms_user",
      JSON.stringify(normalizedUser)
    );

    sessionStorage.setItem("gms_token", userToken);
    sessionStorage.setItem("gms_logged_in", "true");
  };

  const logout = () => {
    setUser(null);
    setToken("");
    setVehicles([]);
    setSettings(DEFAULT_SETTINGS);

    sessionStorage.removeItem("gms_user");
    sessionStorage.removeItem("gms_token");
    sessionStorage.removeItem("gms_logged_in");
    sessionStorage.removeItem("gms_welcome_shown");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        login,
        logout,
        vehicles,
        setVehicles,
        settings,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
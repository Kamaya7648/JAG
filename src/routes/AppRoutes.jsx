import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Profile from "../pages/supervisor/Profile";
import Dashboard from "../pages/Dashboard/Dashboard";
import ReportGeneration from "../pages/ReportGeneration/ReportGeneration";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/supervisor/profile" element={<Profile />} />
      <Route path="/report-generation" element={<ReportGeneration />} />
    </Routes>
  );
};

export default AppRoutes;
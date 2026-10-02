import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";

import Home from "../pages/Home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import DashboardLayout from "../layouts/DashboardLayout";

import StudentDashboard from "../pages/student/StudentDashboard";
import StaffDashboard from "../pages/staff/StaffDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AppRouter = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ================= PROTECTED ROUTES ================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* STUDENT */}
          <Route element={<RoleRoute allowedRoles={["STUDENT"]} />}>
            <Route
              path="/student/dashboard"
              element={<StudentDashboard />}
            />
          </Route>

          {/* STAFF */}
          <Route element={<RoleRoute allowedRoles={["STAFF"]} />}>
            <Route
              path="/staff/dashboard"
              element={<StaffDashboard />}
            />
          </Route>

          {/* ADMIN */}
          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
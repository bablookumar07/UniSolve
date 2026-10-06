import { BrowserRouter, Route, Routes } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";

import Home from "./pages/public/Home";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import DashboardLayout from "./layouts/DashboardLayout";

import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffComplaints from "./pages/staff/StaffComplaints";
import StaffComplaintDetails from "./pages/staff/StaffComplaintDetails";
import StaffNotifications from "./pages/staff/StaffNotifications";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminComplaintDetails from "./pages/admin/AdminComplaintDetails";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminNotifications from "./pages/admin/AdminNotifications";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentComplaints from "./pages/student/StudentComplaints";
import StudentComplaintDetails from "./pages/student/StudentComplaintDetails";
import NewComplaint from "./pages/student/NewComplaint";
import StudentNotifications from "./pages/student/StudentNotifications";
import StudentCases from "./pages/student/StudentCases";
import NewCase from "./pages/student/NewCase";
import StudentCaseDetails from "./pages/student/StudentCaseDetails";
import StudentSupport from "./pages/student/StudentSupport";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC WEBSITE ================= */}

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* ================= AUTH ROUTES ================= */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

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

            <Route element={<RoleRoute allowedRoles={["STUDENT"]} />}>
  <Route
    path="/student/dashboard"
    element={<StudentDashboard />}
  />

  <Route
    path="/student/complaints"
    element={<StudentComplaints />}
  />

  <Route
  path="/student/complaints/:id"
  element={<StudentComplaintDetails />}
/>

<Route
  path="/student/complaints/new"
  element={<NewComplaint />}
/>

 <Route
    path="/student/notifications"
    element={<StudentNotifications />}
  />
  

 <Route
    path="/student/cases"
    element={<StudentCases />}
  />

  <Route
  path="/student/cases/new"
  element={<NewCase />}
/>

<Route
  path="/student/cases/:id"
  element={<StudentCaseDetails />}
/>

<Route
  path="/student/requests"
  element={<StudentSupport />}
/>
  
</Route>



            {/* STAFF */}
           <Route element={<RoleRoute allowedRoles={["STAFF"]} />}>
  
  <Route path="/staff/dashboard" element={<StaffDashboard />} />
  
  <Route path="/staff/complaints" element={<StaffComplaints />} />

  <Route
    path="/staff/complaints/:id"
    element={<StaffComplaintDetails />}
  />

  <Route
    path="/staff/notifications"
    element={<StaffNotifications />}
  />

</Route>

            {/* ADMIN */}
            <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
              
              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />

              <Route
    path="/admin/complaints"
    element={<AdminComplaints />}
  />

       <Route
    path="/admin/complaints/:id"
    element={<AdminComplaintDetails />}
  />

   <Route
    path="/admin/users"
    element={<AdminUsers />}
  />

  <Route
  path="/admin/categories"
  element={<AdminCategories />}
/>

<Route
  path="/admin/audit-logs"
  element={<AdminAuditLogs />}
/>
  
   <Route
    path="/admin/notifications"
    element={<AdminNotifications />}
  />
            </Route>

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
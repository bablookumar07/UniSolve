import { useState } from "react";
import { Outlet } from "react-router-dom";

import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardTopbar from "../components/dashboard/DashboardTopbar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen">
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
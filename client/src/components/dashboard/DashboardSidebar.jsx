import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Bell,
  Users,
  FileText,
  Tags,
  ClipboardList,
  ShieldCheck,
  X,
} from "lucide-react";

import DashboardNavItem from "./DashboardNavItem";
import { useAuth } from "../../context/AuthContext";
import { getUnreadNotificationCount } from "../../api/notificationApi";

const DashboardSidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const role = user?.role;

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await getUnreadNotificationCount();

        setUnreadCount(data.count || 0);
      } catch (error) {
        console.error(
          "Failed to fetch unread notification count:",
          error
        );
      }
    };

    fetchUnreadCount();
  }, []);

  const studentLinks = [
    {
      to: "/student/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/student/complaints",
      label: "My Complaints",
      icon: MessageSquare,
    },
    {
      to: "/student/notifications",
      label: "Notifications",
      icon: Bell,
    },
  ];

  const staffLinks = [
    {
      to: "/staff/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/staff/complaints",
      label: "Assigned Complaints",
      icon: ClipboardList,
    },
    {
      to: "/staff/notifications",
      label: "Notifications",
      icon: Bell,
    },
  ];

  const adminLinks = [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/admin/complaints",
      label: "Complaints",
      icon: MessageSquare,
    },
    {
      to: "/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      to: "/admin/categories",
      label: "Categories",
      icon: Tags,
    },
    {
      to: "/admin/audit-logs",
      label: "Audit Logs",
      icon: FileText,
    },
    {
      to: "/admin/notifications",
      label: "Notifications",
      icon: Bell,
    },
  ];

  const links =
    role === "STUDENT"
      ? studentLinks
      : role === "STAFF"
        ? staffLinks
        : role === "ADMIN"
          ? adminLinks
          : [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-gray-200 bg-white
          transition-transform duration-300
          dark:border-slate-800 dark:bg-slate-950
          lg:sticky lg:top-0 lg:h-screen lg:max-h-screen
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between border-b border-gray-200 px-6 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <ShieldCheck size={21} />
            </div>

            {/* Brand */}
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                UniSolve
              </h1>

              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {role === "STUDENT"
                  ? "Student Portal"
                  : role === "STAFF"
                    ? "Staff Portal"
                    : role === "ADMIN"
                      ? "Admin Portal"
                      : "Portal"}
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {links.map((link) => (
            <div
              key={link.to}
              className="relative"
            >
              <DashboardNavItem
                to={link.to}
                icon={link.icon}
                label={link.label}
                onClick={onClose}
              />

              {/* Notification Badge */}
              {link.label === "Notifications" &&
                unreadCount > 0 && (
                  <span
                    className="
                      pointer-events-none absolute right-3 top-1/2
                      flex min-h-5 min-w-5 -translate-y-1/2
                      items-center justify-center
                      rounded-full bg-red-500 px-1.5
                      text-[10px] font-bold text-white
                    "
                  >
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;
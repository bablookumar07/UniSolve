import {
  Menu,
  Sun,
  Moon,
  LogOut,
  User,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const DashboardTopbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-950/95">
      {/* Left */}
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={22} />
      </button>

      {/* Right */}
      <div className="ml-auto flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun size={19} />
          ) : (
            <Moon size={19} />
          )}
        </button>

        {/* User */}
        <div className="hidden items-center gap-3 border-l border-gray-200 pl-4 sm:flex dark:border-slate-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
            <User size={18} />
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.role}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl p-2.5 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          aria-label="Logout"
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
};

export default DashboardTopbar;
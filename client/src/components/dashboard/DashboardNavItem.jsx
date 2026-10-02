import { NavLink } from "react-router-dom";

const DashboardNavItem = ({ to, icon: Icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white"
        }`
      }
    >
      <Icon size={19} strokeWidth={2} />
      <span>{label}</span>
    </NavLink>
  );
};

export default DashboardNavItem;
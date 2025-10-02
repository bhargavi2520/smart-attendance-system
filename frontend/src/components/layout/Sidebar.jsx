// File: src/components/layout/Sidebar.jsx (Updated)

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
  const { activeRole } = useAuth(); // Using activeRole is better for users with multiple roles

  const getNavLinks = () => {
    // Base links for all roles
    const base = [{ to: "/", text: "Dashboard", icon: <LayoutDashboard /> }];

    // Role-specific links
    switch (activeRole) {
      case "student":
        return [
          ...base,
          {
            to: "/my-attendance",
            text: "My Attendance",
            icon: <CalendarCheck />,
          },
        ];
      case "faculty":
        // CHANGED: Added the specific links for the faculty dashboard design
        return [
          ...base,
          { to: "/attendance", text: "Attendance", icon: <CalendarCheck /> },
          { to: "/reports", text: "Reports", icon: <BarChart3 /> },
          { to: "/settings", text: "Settings", icon: <Settings /> },
        ];
      case "hod":
        return [
          ...base,
          {
            to: "/reports/department",
            text: "Dept. Report",
            icon: <BarChart3 />,
          },
        ];
      default:
        return base;
    }
  };

  const navLinks = getNavLinks();

  // ADDED: Better styling for active/inactive links
  const activeLink =
    "flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg";
  const inactiveLink =
    "flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white";

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      {/* ADDED: A professional header for the sidebar */}
      <div className="px-6 py-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">EduTrack</h1>
        <p className="text-xs text-gray-400">Smart Attendance</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"} // Ensures Dashboard is only active on the index page
            className={({ isActive }) => (isActive ? activeLink : inactiveLink)}
          >
            {link.icon}
            <span className="ml-3">{link.text}</span>
          </NavLink>
        ))}
      </nav>

      {/* ADDED: A help section at the bottom */}
      <div className="px-4 py-4 border-t border-gray-700">
        <NavLink to="/help" className={inactiveLink}>
          <HelpCircle className="w-5 h-5" />
          <span className="ml-3">Help</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;

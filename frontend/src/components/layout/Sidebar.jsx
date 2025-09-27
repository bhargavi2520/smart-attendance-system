// This component is not used in the current Layout for simplicity,
// but can be integrated if a side navigation is desired.
import { NavLink } from "react-router-dom";
import { LayoutDashboard, CheckSquare, BarChart2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
  const { user } = useAuth();

  const getNavLinks = () => {
    const base = [{ to: "/", text: "Dashboard", icon: <LayoutDashboard /> }];

    switch (user?.role) {
      case "STUDENT":
        return [
          ...base,
          {
            to: "/my-attendance",
            text: "My Attendance",
            icon: <CheckSquare />,
          },
        ];
      case "FACULTY":
        return base; // Dashboard shows classes to mark
      case "HOD":
        return [
          ...base,
          {
            to: "/reports/department",
            text: "Dept. Report",
            icon: <BarChart2 />,
          },
        ];
      default:
        return base;
    }
  };

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">Dashboard</div>
      <nav className="flex-1 px-2 space-y-1">
        {getNavLinks().map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                isActive ? "bg-gray-900" : "hover:bg-gray-700"
              }`
            }
          >
            {link.icon}
            <span className="ml-3">{link.text}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

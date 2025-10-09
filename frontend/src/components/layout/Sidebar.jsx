import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  BarChart3,
  Settings,
  HelpCircle,
  Users,
  UserCheck,
  Calendar,
  BookOpen,
  X,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import loginIcon from "../../assets/logo.png";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { activeRole } = useAuth(); // Using activeRole is better for users with multiple roles

  const getNavLinks = () => {
    // Base links for all roles
    const facultyLinks = [
      { to: "/attendance", text: "Attendance", icon: <CalendarCheck /> },
      { to: "/reports", text: "Reports", icon: <BarChart3 /> },
    ];
    const settings = { to: "/settings", text: "Settings", icon: <Settings /> };

    // Role-specific links
    switch (activeRole) {
      case "student":
        return [
          {
            to: "/student/dashboard",
            text: "Dashboard",
            icon: <LayoutDashboard />,
          },
          {
            to: "/my-attendance",
            text: "My Attendance",
            icon: <CalendarCheck />,
          },
          settings,
        ];
      case "faculty":
        // CHANGED: Added the specific links for the faculty dashboard design
        return [
          {
            to: "/faculty/dashboard",
            text: "Dashboard",
            icon: <LayoutDashboard />,
          },
          ...facultyLinks,
          settings,
        ];
      case "hod":
        return [
          {
            to: "/hod/dashboard",
            text: "Dashboard",
            icon: <LayoutDashboard />,
          },
          ...facultyLinks,
          {
            to: "/reports/department",
            text: "Dept. Report",
            icon: <BarChart3 />,
          },
          settings,
        ];
      case "principal":
        return [
          {
            to: "/principal/dashboard",
            text: "Dashboard",
            icon: <LayoutDashboard />,
          },
          ...facultyLinks,
          {
            to: "/reports/college",
            text: "College Report",
            to: "/principal/reports/attendance",
            text: "Attendance Reports",
            icon: <BarChart3 />,
          },
          {
            to: "/principal/reports/faculty",
            text: "Faculty Reports",
            icon: <UserCheck />,
          },
          {
            to: "/principal/reports/enrollment",
            text: "Enrollment Reports",
            icon: <Users />,
          },
          settings,
        ];
      case "admin":
        // This is the new section that adds all the admin links
        return [
          {
            to: "/admin/dashboard",
            text: "Dashboard",
            icon: <LayoutDashboard />,
          },
          {
            to: "/admin/classes",
            text: "Class Management",
            icon: <BookOpen />,
          },
          {
            to: "/admin/students",
            text: "Student Management",
            icon: <Users />,
          },
          {
            to: "/admin/faculty",
            text: "Faculty Management",
            icon: <UserCheck />,
          },
          {
            to: "/admin/timetables",
            text: "Timetable Management",
            icon: <Calendar />,
          },
          settings, // Add settings to admin links
        ];
      default:
        return [{ to: "/", text: "Dashboard", icon: <LayoutDashboard /> }];
    }
  };

  const navLinks = getNavLinks();

  const activeLink =
    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg";
  const inactiveLink =
    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white";

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Sidebar Header */}
        <div className="px-4 h-16 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={loginIcon}
              alt="EduTrack Logo"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-white">EduTrack</h1>
              <p className="text-xs text-gray-400">Smart Attendance</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 -mr-2 rounded-md hover:bg-gray-700"
            aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/" || link.to.endsWith("dashboard")}
              className={({ isActive }) =>
                isActive ? activeLink : inactiveLink
              }
              onClick={closeSidebar} // Close sidebar on link click
            >
              {link.icon}
              <span>{link.text}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-700">
          <NavLink
            to="/help"
            className={inactiveLink}
            onClick={() => setSidebarOpen(false)}>
            <HelpCircle className="w-5 h-5" />
            <span>Help</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

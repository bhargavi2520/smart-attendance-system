import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { LogOut, Repeat, Menu } from "lucide-react";

const getPageTitle = (pathname) => {
  const name = pathname.split("/").pop().replace(/-/g, " ");
  if (name === "" || name === "admin") return "Dashboard";
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const Header = ({ setSidebarOpen = () => {} }) => {
  const { user, logout, setActiveRole } = useAuth();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // this ensures UI updates instantly when switching role
  const [activeRole, setLocalActiveRole] = useState(user?.activeRole || "");

  useEffect(() => {
    setLocalActiveRole(user?.activeRole || "");
  }, [user?.activeRole]);

  const handleRoleSelect = (role) => {
    if (setActiveRole) {
      setActiveRole(role.toLowerCase());
    }
    setLocalActiveRole(role.toLowerCase()); // local instant update
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  let otherRoles = user?.roles?.filter(
    (role) => role.toLowerCase() !== activeRole?.toLowerCase()
  );

  // When on a faculty-type dashboard, only show other relevant faculty roles.
  const isFacultyView = ["faculty", "hod", "principal"].includes(activeRole);
  if (isFacultyView) {
    otherRoles = otherRoles?.filter(
      (role) =>
        // Only show the 'incharge' role as a switchable option for faculty
        role.toLowerCase() === "incharge"
    );
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden -ml-2 mr-2 p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              aria-label="Open sidebar">
              <Menu className="h-6 w-6" />
            </button>

            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Role Switcher */}
            {user && user.roles.length > 1 ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 rounded-lg p-2 border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  title="Switch Role">
                  <Repeat className="h-4 w-4" />
                  <span className="capitalize text-xs md:text-sm font-medium">
                    {activeRole}
                  </span>
                </button>

                {isDropdownOpen && otherRoles && otherRoles.length > 0 && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical">
                      <p className="px-4 pt-2 pb-1 text-xs font-medium text-gray-400">
                        Switch to:
                      </p>
                      {otherRoles.map((role) => (
                        <button
                          key={role}
                          onClick={() => handleRoleSelect(role)}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 capitalize hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          title={`Switch to ${role} role`}>
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-700 capitalize">{activeRole}</p>
              </div>
            )}

            {/* User Name */}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name}
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              type="button"
              className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Log out">
              <span className="sr-only">Log out</span>
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

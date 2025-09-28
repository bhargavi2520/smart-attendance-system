import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { LogOut, User as UserIcon, Shield } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Smart Attendance
            </Link>
          </div>
          <div className="flex items-center">
            <div className="relative ml-3">
              <div className="flex items-center space-x-4">
                {/* CONDITIONAL ADMIN LINK */}
                {user && user.role === "ADMIN" && (
                  <Link
                    to="/admin/users"
                    className="flex items-center text-gray-600 hover:text-indigo-600"
                  >
                    <Shield className="h-5 w-5 mr-1" />
                    <span>Admin</span>
                  </Link>
                )}

                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  type="button"
                  className="rounded-full bg-white p-1 text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Log out</span>
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

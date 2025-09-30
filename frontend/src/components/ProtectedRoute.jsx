import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "./ui/Spinner";

const ProtectedRoute = ({ children, roles }) => {
  const { user, activeRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user has multiple roles and no active role is selected, redirect to select-role page
  // Allow access to the select-role page itself
  if (user.roles.length > 1 && !activeRole && location.pathname !== '/select-role') {
    return <Navigate to="/select-role" replace />;
  }

  // If the user is trying to access the select-role page but has an active role, redirect to dashboard
  if (location.pathname === '/select-role' && activeRole) {
      return <Navigate to="/" replace />;
  }

  // Check if the active role has access to the route
  if (roles && !roles.includes(activeRole)) {
    // Redirect to dashboard or an unauthorized page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
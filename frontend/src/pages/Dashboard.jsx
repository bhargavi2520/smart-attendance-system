import useAuth from "../hooks/useAuth";
import StudentDashboard from "./dashboards/StudentDashboard";
import FacultyDashboard from "./dashboards/FacultyDashboard";
import HodDashboard from "./dashboards/HodDashboard";
import PrincipalDashboard from "./dashboards/PrincipalDashboard";
import Spinner from "../components/ui/Spinner";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, activeRole, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-full pt-20">
        <Spinner />
      </div>
    );
  }

  // If user has multiple roles but hasn't selected one for the session, redirect.
  if (user.roles.length > 1 && !activeRole) {
    return <Navigate to="/select-role" replace />;
  }

  // Render dashboard based on the single active role.
  switch (activeRole) {
    case "student":
      return <StudentDashboard />;
    case "faculty":
      return <FacultyDashboard />;
    case "hod":
      return <HodDashboard />;
    case "principal":
      return <PrincipalDashboard />;
    case "admin":
      return <Navigate to="/admin/users" replace />;
    default:
      // This can happen if the role is invalid or if a single-role user logs in
      // and their role hasn't been set as activeRole yet.
      if (user.roles.length > 0) {
        // If there's no active role, but there are roles, we might be waiting for context to update
        return <Spinner />;
      }
      return <div>Invalid user role or dashboard not available.</div>;
  }
};

export default Dashboard;

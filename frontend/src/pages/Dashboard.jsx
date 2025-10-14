// File: src/pages/Dashboard.jsx (WITH DEBUGGING LOGS)

import useAuth from "../hooks/useAuth";
import Spinner from "../components/ui/Spinner";
import { Navigate } from "react-router-dom";

//import all the role specific dashboard
import StudentDashboard from "./dashboards/StudentDashboard";
import FacultyDashboard from "./dashboards/FacultyDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import InchargeDashboard from "./dashboards/InchargeDashboard";
import PrincipalDashboard from "./dashboards/PrincipalDashboard";
import HodDashboard from "./dashboards/HodDashboard";

const Dashboard = () => {
  const { user, activeRole, loading } = useAuth();

  if (loading || !user) {
    // If we are stuck here, show centered spinner (Spinner provides responsive min-height)
    return <Spinner />;
  }

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
    case "incharge":
      return <InchargeDashboard />;
    case "principal":
      return <PrincipalDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      // This case handles the brief moment before the activeRole is set
      // or if the role is somehow invalid.
      if (user.roles.length > 0) {
        return <Spinner />;
      }
      return <div>Invalid user role or dashboard not available.</div>;
  }
};

export default Dashboard;

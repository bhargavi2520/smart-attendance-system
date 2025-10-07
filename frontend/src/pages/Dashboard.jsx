// File: src/pages/Dashboard.jsx (WITH DEBUGGING LOGS)

import useAuth from "../hooks/useAuth";
import Spinner from "../components/ui/Spinner";
import { Navigate } from "react-router-dom";

//import all the role specific dashboard
import StudentDashboard from "./dashboards/StudentDashboard";
import FacultyDashboard from "./dashboards/FacultyDashboard";
import HodDashboard from "./dashboards/HodDashboard";
import PrincipalDashboard from "./dashboards/PrincipalDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

const Dashboard = () => {
  const { user, activeRole, loading } = useAuth();

  // Let's see what the useAuth hook is giving us.
  console.log("--- Dashboard Gatekeeper ---");
  console.log("Loading status:", loading);
  console.log("User object:", user);
  console.log("Active Role:", activeRole);
  console.log("--------------------------");

  if (loading || !user) {
    // If we are stuck here, the auth context is not providing the user object yet.
    return (
      <div className="flex items-center justify-center h-full pt-20">
        <Spinner />
      </div>
    );
  }

  if (user.roles.length > 1 && !activeRole) {
    return <Navigate to="/select-role" replace />;
  }

  // Render dashboard based on the single active role.
  switch (activeRole) {
    case "student":
      console.log("Rendering StudentDashboard");
      return <StudentDashboard />;
    case "faculty":
      console.log("Rendering FacultyDashboard");
      return <FacultyDashboard />;
    case "hod":
      console.log("Rendering HodDashboard");
      return <HodDashboard />;
    case "principal":
      console.log("Rendering PrincipalDashboard");
      return <PrincipalDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      console.log(
        `Default case hit. ActiveRole is '${activeRole}'. Unable to render a matching dashboard.`
      );
      if (user.roles.length > 0) {
        return <Spinner />;
      }
      return <div>Invalid user role or dashboard not available.</div>;
  }
};

export default Dashboard;

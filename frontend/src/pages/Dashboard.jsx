import useAuth from "../hooks/useAuth";
import StudentDashboard from "./dashboards/StudentDashboard";
import FacultyDashboard from "./dashboards/FacultyDashboard";
import HodDashboard from "./dashboards/HodDashboard";
import PrincipalDashboard from "./dashboards/PrincipalDashboard";
import Spinner from "../components/ui/Spinner";

// This component acts as a router for different user roles
const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-full pt-20">
        <Spinner />
      </div>
    );
  }

  switch (user?.role) {
    case "STUDENT":
      return <StudentDashboard />;
    case "FACULTY":
      return <FacultyDashboard />;
    case "INCHARGE":
      // In this setup, Incharge shares a dashboard with HOD
      return <HodDashboard />;
    case "HOD":
      return <HodDashboard />;
    case "PRINCIPAL":
      return <PrincipalDashboard />;
    default:
      return <div>Invalid user role or not logged in.</div>;
  }
};

export default Dashboard;

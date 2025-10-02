// File: src/pages/dashboards/FacultyDashboard.jsx (Corrected)

import { useState, useEffect } from "react";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";
//import Spinner from "../../components/ui/Spinner";
import ClassSchedule from "../faculty/ClassSchedule";
import RecentAttendance from "../faculty/RecentAttendance";
import SubjectSummary from "../faculty/SubjectSummary";

const FacultyDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    todayClasses: [],
    recentActions: [],
    summary: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [classesRes, recentRes, summaryRes] = await Promise.all([
          // CORRECTED: Added the missing '/api' prefix to the path
          api.get("/api/attendance/faculty/today"),
          api.get("/api/faculty/attendance/recent"),
          api.get("/api/faculty/attendance/summary"),
        ]);

        setDashboardData({
          todayClasses: classesRes.data,
          recentActions: recentRes.data,
          summary: summaryRes.data,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full pt-20">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  const noData =
    !dashboardData.todayClasses?.length &&
    !dashboardData.recentActions?.length &&
    !dashboardData.summary?.length;

  if (noData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Professor!</p>
        </header>
        <div className="text-center py-12">
          <p className="text-gray-500">
            No dashboard data available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Professor!</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Changed grid layout to be more responsive like the design */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <ClassSchedule classes={dashboardData.todayClasses} />
          <SubjectSummary summary={dashboardData.summary} />
        </div>
        <div className="lg:col-span-1">
          <RecentAttendance actions={dashboardData.recentActions} />
        </div>
      </main>
    </div>
  );
};

export default FacultyDashboard;

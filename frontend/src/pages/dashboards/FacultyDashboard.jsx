// File: src/pages/dashboards/FacultyDashboard.jsx (Complete Mobile Responsive)
import { useState, useEffect } from "react";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";
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
        const [classesRes, recentRes, summaryRes] = await Promise.all([
          api.get("/api/attendance/faculty/today"),
          api.get("/api/faculty/attendance/recent"),
          api.get("/api/faculty/attendance/summary"),
        ]);

        setDashboardData({
          todayClasses: Array.isArray(classesRes.data) ? classesRes.data : [],
          recentActions: Array.isArray(recentRes.data) ? recentRes.data : [],
          summary: Array.isArray(summaryRes.data) ? summaryRes.data : [],
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
      <div className="flex items-center justify-center min-h-screen px-4">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md w-full">
          <p className="text-red-600 text-center text-sm sm:text-base">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const noData =
    !dashboardData.todayClasses?.length &&
    !dashboardData.recentActions?.length &&
    !dashboardData.summary?.length;

  if (noData) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Welcome back, Professor!
          </p>
        </header>
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl sm:text-4xl">📊</span>
            </div>
            <p className="text-gray-500 text-sm sm:text-base">
              No dashboard data available at the moment.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              Data will appear here once classes are scheduled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header - Responsive */}
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Welcome back, Professor!
        </p>
      </header>

      {/* Main Content - Responsive Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Column - Full width on mobile, 2 columns on desktop */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6 lg:gap-8">
          <ClassSchedule classes={dashboardData.todayClasses} />
          <SubjectSummary summary={dashboardData.summary} />
        </div>

        {/* Right Column - Full width on mobile, 1 column on desktop */}
        <div className="lg:col-span-1">
          <RecentAttendance actions={dashboardData.recentActions} />
        </div>
      </main>
    </div>
  );
};

export default FacultyDashboard;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import {
  Users,
  BookOpen,
  UserCheck,
  BarChart3,
  Activity,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4">
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6"];

const quickLinks = [
  {
    title: "Class Management",
    icon: <BookOpen className="w-6 h-6 text-blue-500" />,
    to: "/admin/classes",
  },
  {
    title: "Student Management",
    icon: <Users className="w-6 h-6 text-green-500" />,
    to: "/admin/students",
  },
  {
    title: "Faculty Management",
    icon: <UserCheck className="w-6 h-6 text-purple-500" />,
    to: "/admin/faculty",
  },
];

export default function AdminDashboard() {
  const [data, setData] = useState({
    stats: { totalClasses: 0, totalStudents: 0, totalFaculty: 0 },
    attendanceData: [],
    userRolesData: [],
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // --- REAL API CALL ---
        // This calls the getStats function in your dashboardController.js
        const { data: statsData } = await api.get("/api/dashboard/stats");

        // --- REAL API CALL ---
        // This calls a function in your analyticsController.js (assuming it exists)
        // If it doesn't exist, you'll need to create it.
        // For now, we'll mock the charts.
        const userRolesData = [
          { name: "Students", value: statsData.totalStudents || 0 },
          { name: "Faculty", value: statsData.totalFaculty || 0 },
        ];

        setData({
          stats: statsData,
          userRolesData: userRolesData,
          attendanceData: [], // TODO: Wire this up to analyticsController
          recentActivities: [], // TODO: Wire this up to an audit log
        });
      } catch (err) {
        console.error("Failed to load dashboard statistics.", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const { stats, attendanceData, userRolesData, recentActivities } = data;

  return (
    <div className="p-2 md:p-4 bg-gray-50 min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's a summary of the system.
        </p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon={<BookOpen className="w-6 h-6 text-blue-800" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users className="w-6 h-6 text-green-800" />}
          color="bg-green-100"
        />
        <StatCard
          title="Total Faculty"
          value={stats.totalFaculty}
          icon={<UserCheck className="w-6 h-6 text-purple-800" />}
          color="bg-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Attendance Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-gray-500" />
              Attendance Overview (Last 7 Days)
            </h2>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Present" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-500" />
              User Distribution
            </h2>
            <div className="mt-4 h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={userRolesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userRolesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex justify-center space-x-6 mt-4">
                {userRolesData.map((entry, index) => (
                  <div
                    key={entry.name}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>
                      {entry.name}:{" "}
                      <span className="font-semibold">{entry.value}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Links & Activity */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Access
            </h2>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.to}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {link.icon}
                    <span className="font-medium text-gray-700">
                      {link.title}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-gray-500" />
              Recent Activity
            </h2>
            <ul className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-gray-700">{activity.text}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No recent activity found.
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

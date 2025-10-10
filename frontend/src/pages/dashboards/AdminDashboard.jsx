import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import {
  Users,
  BookOpen,
  UserCheck,
  BarChart3,
  Calendar,
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
      className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

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
  {
    title: "Timetable Management",
    icon: <Calendar className="w-6 h-6 text-orange-500" />,
    to: "/admin/timetables",
  },
];

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    text: "New student 'John Doe' was registered.",
    time: "2 hours ago",
  },
  {
    id: 2,
    text: "Class 'CSE-B' was created for the 2024-2028 batch.",
    time: "5 hours ago",
  },
  {
    id: 3,
    text: "Faculty 'Dr. Jane Smith' updated her profile.",
    time: "1 day ago",
  },
  {
    id: 4,
    text: "Timetable for 'ECE-A' was published.",
    time: "2 days ago",
  },
];

// Mock data for the attendance chart
const attendanceData = [
  { day: "Mon", Present: 430, Absent: 50 },
  { day: "Tue", Present: 450, Absent: 30 },
  { day: "Wed", Present: 465, Absent: 15 },
  { day: "Thu", Present: 440, Absent: 40 },
  { day: "Fri", Present: 470, Absent: 10 },
  { day: "Sat", Present: 410, Absent: 70 },
];

// Mock data for the user roles pie chart
const userRolesData = [
  { name: "Students", value: 480 },
  { name: "Faculty", value: 35 },
  { name: "Admins", value: 2 },
];

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white rounded-lg shadow-lg border border-gray-200">
        <p className="font-bold text-gray-800">{`${label}`}</p>
        <p className="text-sm text-blue-500">{`Present: ${payload[0].value}`}</p>
        <p className="text-sm text-red-500">{`Absent: ${payload[1].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Using dummy data for now as requested
      // const { data } = await api.get("/api/dashboard/stats");
      const dummyStats = {
        totalClasses: 12,
        totalStudents: 480,
        totalFaculty: 35,
      };
      setStats(dummyStats);
    } catch (err) {
      console.error("Failed to load dashboard statistics.", err);
      // Fallback to 0 if API fails
      setStats({ totalClasses: 0, totalStudents: 0, totalFaculty: 0 });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <div className="p-6 md:p-8 bg-gray-50 min-h-full">
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
            value={stats?.totalClasses || 0}
            icon={<BookOpen className="w-6 h-6 text-blue-800" />}
            color="bg-blue-100"
          />
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={<Users className="w-6 h-6 text-green-800" />}
            color="bg-green-100"
          />
          <StatCard
            title="Total Faculty"
            value={stats?.totalFaculty || 0}
            icon={<UserCheck className="w-6 h-6 text-purple-800" />}
            color="bg-purple-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Charts and Overview */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-gray-500" />
                Attendance Overview
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Chart showing overall attendance percentage for the last 30
                days.
              </p>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={attendanceData}
                    margin={{
                      top: 5,
                      right: 20,
                      left: -10,
                      bottom: 5,
                    }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      vertical={false}
                    />
                    <XAxis dataKey="day" fontSize={12} tickLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(243, 244, 246, 0.5)" }}
                    />
                    <Legend iconType="circle" iconSize={10} />
                    <Bar
                      dataKey="Present"
                      fill="#3b82f6"
                      name="Present"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Absent"
                      fill="#ef4444"
                      name="Absent"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Users className="w-5 h-5 mr-2 text-gray-500" />
                User Distribution
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Distribution of roles across the system.
              </p>
              <div className="mt-4 h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userRolesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name">
                      {userRolesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-2">
                {userRolesData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center text-sm">
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}></span>
                    {entry.name}: {entry.value}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Access and Recent Activity */}
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
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-gray-700">{activity.text}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React from "react";
import {
  Users,
  UserCheck,
  Building,
  UserX,
  TrendingUp,
  Calendar,
  Bell,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { principalData } from "../../components/layout/dummy-data";
import useAuth from "../../hooks/useAuth";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
    <Icon className={`w-10 h-10 mb-3 ${color}`} />
    <p className="text-4xl font-bold text-gray-800">{value}</p>
    <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
  </div>
);

const UpcomingEvents = () => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-bold text-gray-800 mb-4">
      Upcoming Events & Holidays
    </h3>
    <div className="space-y-4">
      {principalData.upcomingEvents.map((event, index) => (
        <div key={index} className="flex items-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex flex-col items-center justify-center mr-4">
            <span className="text-sm font-bold text-gray-700">
              {event.date.split(" ")[0]}
            </span>
            <span className="text-xs text-gray-500">
              {event.date.split(" ")[1]}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-800">{event.title}</p>
            <p className="text-xs capitalize text-gray-500">{event.type}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Alerts = () => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Notices & Alerts</h3>
    <div className="space-y-3">
      {principalData.alerts.map((alert, index) => (
        <div
          key={index}
          className={`flex items-start p-3 rounded-lg ${
            alert.severity === "warning" ? "bg-yellow-50" : "bg-blue-50"
          }`}>
          {alert.severity === "warning" ? (
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
          )}
          <p className="text-sm text-gray-700">{alert.text}</p>
        </div>
      ))}
    </div>
  </div>
);

const DepartmentAttendanceChart = () => (
  <div className="bg-white p-6 rounded-xl shadow-md h-full">
    <h3 className="text-lg font-bold text-gray-800 mb-4">
      Department-wise Attendance (Today)
    </h3>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={principalData.departmentAttendance}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis unit="%" domain={[70, 100]} fontSize={12} />
          <Tooltip
            cursor={{ fill: "rgba(238, 242, 255, 0.6)" }}
            contentStyle={{ borderRadius: "8px", borderColor: "#e0e0e0" }}
          />
          <Bar dataKey="attendance" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const PrincipalDashboard = () => {
  const { user } = useAuth();
  const { overview } = principalData;

  const studentsAbsent = overview.totalStudents - overview.studentsPresentToday;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Principal's Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome, {user?.name}. Here's an overview of the institution today.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard
          title="Total Students"
          value={overview.totalStudents}
          icon={Users}
          color="text-blue-500"
        />
        <StatCard
          title="Total Faculty"
          value={overview.totalFaculty}
          icon={UserCheck}
          color="text-indigo-500"
        />
        <StatCard
          title="Total Departments"
          value={overview.totalDepartments}
          icon={Building}
          color="text-purple-500"
        />
        <StatCard
          title="Students Absent"
          value={studentsAbsent}
          icon={UserX}
          color="text-red-500"
        />
        <StatCard
          title="Avg. Attendance"
          value={`${overview.averageAttendance}%`}
          icon={TrendingUp}
          color="text-green-500"
        />
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DepartmentAttendanceChart />
        </div>
        <div className="space-y-8">
          <UpcomingEvents />
          <Alerts />
        </div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;

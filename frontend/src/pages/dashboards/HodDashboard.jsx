import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  PieChart as PieChartIcon,
  BarChart3,
  Mail,
  FileText,
  Settings,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const StatCard = ({ title, value, icon, color, change }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    {change && (
      <p
        className={`text-xs mt-1 flex items-center ${
          change.startsWith("+") ? "text-green-600" : "text-red-600"
        }`}>
        {change} vs last week
      </p>
    )}
  </div>
);

const mockData = {
  departmentAttendance: 92,
  absenteesToday: 18,
  presentsToday: 232,
  pendingLeaveRequests: 4,
  lowAttendanceStudents: [
    { id: 1, name: "Rohan Verma", class: "CSE-A", percentage: 68 },
    { id: 2, name: "Priya Singh", class: "CSE-B", percentage: 71 },
    { id: 3, name: "Amit Kumar", class: "CSE-A", percentage: 65 },
  ],
  attendanceTrend: [
    { day: "Mon", attendance: 94 },
    { day: "Tue", attendance: 91 },
    { day: "Wed", attendance: 88 },
    { day: "Thu", attendance: 93 },
    { day: "Fri", attendance: 95 },
  ],
  classPerformance: [
    { name: "CSE-D", attendance: 98, type: "top" },
    { name: "CSE-C", attendance: 96, type: "top" },
    { name: "CSE-A", attendance: 78, type: "bottom" },
    { name: "CSE-B", attendance: 81, type: "bottom" },
  ],
  facultyStatus: [
    { name: "Dr. Alan", marked: true },
    { name: "Dr. Grace", marked: true },
    { name: "Dr. Linus", marked: false },
    { name: "Dr. Codd", marked: true },
  ],
};

const HodDashboard = () => {
  const topClasses = mockData.classPerformance.filter((c) => c.type === "top");
  const bottomClasses = mockData.classPerformance.filter(
    (c) => c.type === "bottom"
  );

  return (
    <div className="p-2 md:p-4 bg-gray-50 min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">HOD Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Department of Computer Science & Engineering Overview
        </p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Dept. Attendance"
          value={`${mockData.departmentAttendance}%`}
          icon={<PieChartIcon className="w-5 h-5 text-blue-800" />}
          color="bg-blue-100"
          change="+2%"
        />
        <StatCard
          title="Absentees Today"
          value={mockData.absenteesToday}
          icon={<Users className="w-5 h-5 text-red-800" />}
          color="bg-red-100"
        />
        <StatCard
          title="Presents Today"
          value={mockData.presentsToday}
          icon={<UserCheck className="w-5 h-5 text-green-800" />}
          color="bg-green-100"
        />
        <StatCard
          title="Pending Leave Requests"
          value={mockData.pendingLeaveRequests}
          icon={<Mail className="w-5 h-5 text-yellow-800" />}
          color="bg-yellow-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Attendance Trend */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-gray-500" />
              Weekly Attendance Trend
            </h2>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis
                    domain={[70, 100]}
                    tickFormatter={(tick) => `${tick}%`}
                    fontSize={12}
                    width={40}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(243, 244, 246, 0.5)" }}
                    formatter={(value) => [`${value}%`, "Attendance"]}
                  />
                  <Bar
                    dataKey="attendance"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Class Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Top Performing Classes
              </h2>
              <ul className="space-y-3">
                {topClasses.map((c) => (
                  <li
                    key={c.name}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-900">{c.name}</span>
                    <span className="font-bold text-green-700">
                      {c.attendance}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Bottom Performing Classes
              </h2>
              <ul className="space-y-3">
                {bottomClasses.map((c) => (
                  <li
                    key={c.name}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-900">{c.name}</span>
                    <span className="font-bold text-red-700">
                      {c.attendance}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Low Attendance Alerts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
              Low Attendance Alerts
            </h2>
            <ul className="space-y-3">
              {mockData.lowAttendanceStudents.map((student) => (
                <li
                  key={student.id}
                  className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500">{student.class}</p>
                  </div>
                  <span className="font-bold text-red-600">
                    {student.percentage}%
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to="/hod/reports/low-attendance"
              className="text-sm font-medium text-blue-600 hover:underline mt-4 block text-center">
              View All
            </Link>
          </div>

          {/* Faculty Marking Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
              <UserCheck className="w-5 h-5 mr-2 text-gray-500" />
              Faculty Marking Status
            </h2>
            <ul className="space-y-3">
              {mockData.facultyStatus.map((faculty) => (
                <li
                  key={faculty.name}
                  className="flex justify-between items-center text-sm">
                  <p className="text-gray-700">{faculty.name}</p>
                  {faculty.marked ? (
                    <span className="flex items-center text-green-600 text-xs font-semibold">
                      <CheckCircle size={14} className="mr-1.5" /> Marked
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-500 text-xs font-semibold">
                      <AlertTriangle size={14} className="mr-1.5" /> Pending
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Core Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/hod/reports"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-700">
                    Generate Reports
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
              <Link
                to="/hod/leaves"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <span className="font-medium text-gray-700">
                    Manage Leave Requests
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
              <Link
                to="/hod/settings"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-700">
                    Department Settings
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HodDashboard;

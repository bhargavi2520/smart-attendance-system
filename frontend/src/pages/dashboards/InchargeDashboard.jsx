import {
  Users,
  UserCheck,
  UserX,
  ClipboardCheck,
  AlertTriangle,
  Mail,
  BarChart3,
  ChevronRight,
  CalendarClock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

const mockData = {
  className: "CSE Section A",
  totalStrength: 60,
  presentToday: 54,
  absentToday: 4,
  onLeaveToday: 2,
  todaysAbsentees: [
    { name: "Anil Kumar", roll: "21CS101" },
    { name: "Sunita Sharma", roll: "21CS115" },
    { name: "Rajesh Singh", roll: "21CS123" },
    { name: "Priya Patel", roll: "21CS145" },
  ],
  lowAttendanceStudents: [
    { name: "Riya Khan", roll: "21CS108", percentage: 72 },
    { name: "Aadi Joshi", roll: "21CS125", percentage: 68 },
  ],
  pendingLeaveRequests: 3,
  classAttendancePercentage: 88,
};

const InchargeDashboard = () => {
  const attendanceData = [
    { name: "Present", value: mockData.classAttendancePercentage },
    { name: "Absent", value: 100 - mockData.classAttendancePercentage },
  ];
  const COLORS = ["#10b981", "#ef4444"];

  return (
    <div className="p-2 md:p-4 bg-gray-50 min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Class In-charge Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Managing Class:{" "}
          <span className="font-semibold">{mockData.className}</span>
        </p>
      </header>

      {/* Main Action and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1 bg-blue-600 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold mb-4">
            Ready for Today's Roll Call?
          </h2>
          <Link
            to="/attendance"
            className="w-full flex items-center justify-center gap-3 bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-transform transform hover:scale-105">
            <ClipboardCheck className="w-6 h-6" />
            Mark Today's Attendance
          </Link>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Strength"
            value={mockData.totalStrength}
            icon={<Users className="w-5 h-5 text-gray-800" />}
            color="bg-gray-200"
          />
          <StatCard
            title="Present Today"
            value={mockData.presentToday}
            icon={<UserCheck className="w-5 h-5 text-green-800" />}
            color="bg-green-100"
          />
          <StatCard
            title="Absent Today"
            value={mockData.absentToday}
            icon={<UserX className="w-5 h-5 text-red-800" />}
            color="bg-red-100"
          />
          <StatCard
            title="On Leave"
            value={mockData.onLeaveToday}
            icon={<CalendarClock className="w-5 h-5 text-yellow-800" />}
            color="bg-yellow-100"
          />
        </div>
      </div>

      {/* Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Today's Absentees
            </h2>
            {mockData.todaysAbsentees.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {mockData.todaysAbsentees.map((student) => (
                  <li
                    key={student.roll}
                    className="py-3 flex justify-between items-center">
                    <p className="font-medium text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.roll}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">
                Great! Everyone is present today.
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" /> Low
              Attendance Alerts
            </h2>
            <ul className="space-y-3">
              {mockData.lowAttendanceStudents.map((student) => (
                <li
                  key={student.roll}
                  className="flex justify-between items-center text-sm p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500">{student.roll}</p>
                  </div>
                  <span className="font-bold text-red-600">
                    {student.percentage}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Class Attendance (Semester)
            </h2>
            <div className="h-40 w-40 mx-auto relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    startAngle={90}
                    endAngle={450}
                    paddingAngle={2}
                    dataKey="value">
                    {attendanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-gray-800">
                  {mockData.classAttendancePercentage}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/incharge/leaves"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <span className="font-medium text-gray-700">
                    Manage Leave Requests
                  </span>
                </div>
                <span className="bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {mockData.pendingLeaveRequests}
                </span>
              </Link>
              <Link
                to="/incharge/reports"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-700">
                    Generate Reports
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

export default InchargeDashboard;

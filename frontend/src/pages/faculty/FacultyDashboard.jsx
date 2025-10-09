import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { facultyData } from "../../lib/dummy-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  User,
  Book,
  Building,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  PieChart,
} from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-xl font-bold text-gray-800 mb-4">{children}</h2>
);

const ProfileCard = () => {
  const { user } = useAuth();
  const { profile } = facultyData;

  return (
    <Card className="flex flex-col">
      <CardTitle>Faculty Profile</CardTitle>
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{user?.name}</h3>
          <p className="text-sm text-gray-500">{profile.id}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <p className="flex items-center">
          <User className="w-4 h-4 mr-2 text-gray-400" /> {profile.designation}
        </p>
        <p className="flex items-center">
          <Building className="w-4 h-4 mr-2 text-gray-400" />{" "}
          {profile.department}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t">
        <h4 className="font-semibold text-gray-700 mb-2">Assigned Courses</h4>
        <div className="space-y-1">
          {profile.assignedCourses.map((course) => (
            <p
              key={course}
              className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">
              {course}
            </p>
          ))}
        </div>
      </div>
    </Card>
  );
};

const TodaysClasses = () => (
  <Card>
    <CardTitle>Today's Schedule</CardTitle>
    <div className="space-y-4">
      {facultyData.todaysClasses.map((cls) => (
        <div
          key={cls.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-bold text-gray-800">{cls.courseName}</p>
            <p className="text-xs text-gray-500">{cls.className}</p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Clock className="w-3 h-3 mr-1.5" /> {cls.startTime} -{" "}
              {cls.endTime}
              <MapPin className="w-3 h-3 ml-3 mr-1.5" /> {cls.room}
            </div>
          </div>
          <Link
            to={`/mark-attendance/${cls.id}`}
            className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors">
            Mark
          </Link>
        </div>
      ))}
    </div>
  </Card>
);

const ClassInchargePanel = () => {
  const { classIncharge } = facultyData;
  return (
    <Card>
      <CardTitle>Class Incharge: {classIncharge.className}</CardTitle>
      <div className="text-center mb-4">
        <p className="text-4xl font-bold text-blue-600">
          {classIncharge.totalStudents}
        </p>
        <p className="text-sm text-gray-500">Total Students</p>
      </div>
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">Attendance Overview</h4>
        <div className="flex justify-between items-center p-2 bg-green-50 rounded-md">
          <span className="text-sm text-green-800">Above 85%</span>
          <span className="font-bold text-green-800">
            {classIncharge.attendanceSummary.above85}
          </span>
        </div>
        <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-md">
          <span className="text-sm text-yellow-800">75% - 85%</span>
          <span className="font-bold text-yellow-800">
            {classIncharge.attendanceSummary.between75and85}
          </span>
        </div>
        <div className="flex justify-between items-center p-2 bg-red-50 rounded-md">
          <span className="text-sm text-red-800">Below 75%</span>
          <span className="font-bold text-red-800">
            {classIncharge.attendanceSummary.below75}
          </span>
        </div>
      </div>
    </Card>
  );
};

const AttendanceAnalytics = () => (
  <Card className="lg:col-span-2">
    <CardTitle>Course Attendance Analytics</CardTitle>
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <BarChart
          data={facultyData.attendanceAnalytics}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis unit="%" fontSize={12} />
          <Tooltip cursor={{ fill: "rgba(238, 242, 255, 0.6)" }} />
          <Bar dataKey="attendance" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

const QuickActions = () => (
  <Card>
    <CardTitle>Quick Actions</CardTitle>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {facultyData.quickActions.map((action) => (
        <Link
          key={action.name}
          to={action.href}
          className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors">
          <action.icon className="w-6 h-6 mb-1 text-gray-500" />
          <span className="text-xs text-center font-medium">{action.name}</span>
        </Link>
      ))}
    </div>
  </Card>
);

const NotificationsCard = () => (
  <Card>
    <CardTitle>Notifications</CardTitle>
    <div className="space-y-3">
      {facultyData.notifications.map((notif) => (
        <div key={notif.id} className="flex">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <notif.icon className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-800">{notif.text}</p>
            <p className="text-xs text-gray-400">
              From {notif.from} &middot; {notif.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const FacultyDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome back, {user?.name.split(" ")[0]}!
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
          <ProfileCard />
          <NotificationsCard />
        </div>

        {/* Center Column */}
        <div className="lg:col-span-2 xl:col-span-2 space-y-6">
          <TodaysClasses />
          <AttendanceAnalytics />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 xl:col-span-1 space-y-6">
          <ClassInchargePanel />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;

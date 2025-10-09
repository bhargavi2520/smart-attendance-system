import {
  Book,
  ClipboardCheck,
  ClipboardEdit,
  TrendingUp,
  Users,
  Bell,
  FileText,
  UserCog,
} from "lucide-react";

export const facultyData = {
  profile: {
    id: "F-101",
    designation: "Assistant Professor",
    department: "Computer Science & Engineering",
    assignedCourses: [
      "Data Structures (CS201)",
      "Algorithms (CS202)",
      "Operating Systems (CS301)",
      "Database Management (CS302)",
    ],
  },
  today: new Date(),
  todaysClasses: [
    {
      id: "T-001",
      courseName: "Data Structures",
      courseCode: "CS201",
      className: "CSE Section A",
      startTime: "09:00",
      endTime: "10:00",
      room: "A-201",
    },
    {
      id: "T-002",
      courseName: "Algorithms",
      courseCode: "CS202",
      className: "CSE Section B",
      startTime: "11:00",
      endTime: "12:00",
      room: "A-203",
    },
    {
      id: "T-003",
      courseName: "Operating Systems Lab",
      courseCode: "CS301L",
      className: "CSE Section A",
      startTime: "14:00",
      endTime: "16:00",
      room: "Lab-3",
    },
  ],
  weeklyTimetable: {
    monday: [
      { time: "09-10", subject: "CS201", class: "CSE-A" },
      { time: "11-12", subject: "CS202", class: "CSE-B" },
    ],
    tuesday: [{ time: "10-11", subject: "CS301", class: "CSE-A" }],
    wednesday: [
      { time: "09-10", subject: "CS201", class: "CSE-A" },
      { time: "14-16", subject: "CS301L", class: "CSE-A" },
    ],
    thursday: [{ time: "11-12", subject: "CS202", class: "CSE-B" }],
    friday: [{ time: "10-11", subject: "CS301", class: "CSE-A" }],
    saturday: [],
  },
  classIncharge: {
    className: "CSE Section A",
    totalStudents: 60,
    attendanceSummary: {
      above85: 45,
      between75and85: 10,
      below75: 5,
    },
    lowAttendanceStudents: [
      { name: "Riya Khan", roll: "CS101", percentage: 72 },
      { name: "Aadi Joshi", roll: "CS105", percentage: 68 },
      { name: "Anika Reddy", roll: "CS112", percentage: 74 },
    ],
  },
  attendanceAnalytics: [
    { name: "CS201", attendance: 92 },
    { name: "CS202", attendance: 88 },
    { name: "CS301", attendance: 95 },
    { name: "CS302", attendance: 85 },
  ],
  quickActions: [
    { name: "Mark Attendance", icon: ClipboardCheck, href: "/attendance" },
    { name: "View Reports", icon: TrendingUp, href: "/reports" },
    { name: "Manage Students", icon: Users, href: "/admin/students" },
    { name: "Edit Attendance", icon: ClipboardEdit, href: "/edit-attendance" },
    { name: "My Courses", icon: Book, href: "/my-courses" },
    { name: "Profile Settings", icon: UserCog, href: "/settings" },
  ],
  notifications: [
    {
      id: 1,
      icon: FileText,
      text: "Upload Midterm II marks by Friday.",
      from: "HOD",
      time: "2h ago",
    },
    {
      id: 2,
      icon: Bell,
      text: "Faculty meeting scheduled for 4 PM today.",
      from: "Principal",
      time: "1d ago",
    },
  ],
};

import { useState, useEffect } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import { Book, CheckCircle, AlertTriangle } from "lucide-react";

const StudentDashboard = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get("/attendance/student/summary");
        setSummary(response.data);
      } catch (err) {
        setError("Failed to fetch attendance summary.");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        My Attendance Summary
      </h1>
      {summary.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summary.map((course) => (
            <Card key={course.courseCode}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  {course.courseName}
                </h2>
                {course.percentage >= 75 ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4">{course.courseCode}</p>
              <div className="flex justify-between items-baseline">
                <p className="text-sm text-gray-600">
                  {course.attendedClasses} / {course.totalClasses} classes
                </p>
                <p
                  className={`text-2xl font-bold ${getAttendanceColor(
                    course.percentage
                  )}`}
                >
                  {course.percentage.toFixed(2)}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className={`h-2.5 rounded-full ${
                    course.percentage >= 75
                      ? "bg-green-600"
                      : course.percentage >= 50
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
                  style={{ width: `${course.percentage}%` }}
                ></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <Book className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No Attendance Records
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your attendance has not been marked yet.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentDashboard;

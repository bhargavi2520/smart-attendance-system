import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import { Clock, BookOpen, ChevronRight } from "lucide-react";

const FacultyDashboard = () => {
  const [todayClasses, setTodayClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get("/attendance/faculty/today");
        setTodayClasses(response.data);
      } catch (err) {
        setError("Failed to fetch today's classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Today's Classes
      </h1>
      {todayClasses.length > 0 ? (
        <div className="space-y-4">
          {todayClasses.map((session) => (
            <Card
              key={session.id}
              className="hover:shadow-lg transition-shadow"
            >
              <Link to={`/mark-attendance/${session.id}`} className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-indigo-600">
                      {session.Course.courseName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {session.Course.courseCode}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        {session.startTime} - {session.endTime}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-indigo-500">
                    <span>Mark Attendance</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No Classes Today
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You have no scheduled classes for today.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FacultyDashboard;

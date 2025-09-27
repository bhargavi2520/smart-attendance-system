import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";

const MarkAttendance = () => {
  const { timetableId } = useParams();
  const navigate = useNavigate();
  const [sessionInfo, setSessionInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await api.get(
          `/attendance/session/${timetableId}/students`
        );
        setSessionInfo(response.data.timetable);
        setStudents(response.data.students);
        // Initialize all as present
        const initialAttendance = response.data.students.reduce(
          (acc, student) => {
            acc[student.id] = "PRESENT";
            return acc;
          },
          {}
        );
        setAttendance(initialAttendance);
      } catch (err) {
        setError("Failed to fetch session data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [timetableId]);

  const toggleAttendance = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "PRESENT" ? "ABSENT" : "PRESENT",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const attendanceData = Object.entries(attendance).map(
      ([studentId, status]) => ({
        studentId: parseInt(studentId),
        status,
      })
    );

    const payload = {
      timetableId: parseInt(timetableId),
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      attendanceData,
    };

    try {
      const response = await api.post("/attendance/mark", payload);
      setMessage(response.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit attendance.");
    }
  };

  if (loading) return <Spinner />;
  if (error && !students.length) return <p className="text-red-500">{error}</p>;

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Mark Attendance
      </h1>
      <p className="text-gray-600 mb-6">
        Class starting at {sessionInfo?.startTime}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              onClick={() => toggleAttendance(student.id)}
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                attendance[student.id] === "PRESENT"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span className="font-medium">{student.name}</span>
              <span className="text-sm font-semibold">
                {attendance[student.id]}
              </span>
            </div>
          ))}
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {message && <p className="text-green-500 mt-4">{message}</p>}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={message !== ""}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            Submit Attendance
          </button>
        </div>
      </form>
    </Card>
  );
};

export default MarkAttendance;

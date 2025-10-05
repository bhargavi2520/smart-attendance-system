// src/pages/faculty/AttendancePage.jsx

import { useState, useEffect } from "react";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";
// NOTE: This assumes StudentAttendanceList.jsx is in the same folder.
// If it is in `src/components/faculty/`, the path should be `../../components/faculty/StudentAttendanceList`
import StudentAttendanceList from "./StudentAttendanceList";

const AttendancePage = () => {
  const [allMyClasses, setAllMyClasses] = useState([]);
  const [selectedTimetableId, setSelectedTimetableId] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all classes assigned to the logged-in faculty
  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        const response = await api.get("/api/faculty/my-classes");
        setAllMyClasses(response.data);
      } catch (err) {
        setError(
          "Failed to load your classes. Please check the API connection."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyClasses();
  }, []);

  // Fetch students for the class selected from the dropdown
  useEffect(() => {
    if (!selectedTimetableId) {
      setStudents([]);
      setAttendance({});
      return;
    }

    const fetchStudents = async () => {
      setStudentsLoading(true);
      setError(""); // Clear previous errors
      try {
        const response = await api.get(
          `/api/attendance/session/${selectedTimetableId}/students`
        );
        setStudents(response.data.students);
        // Initialize all students as 'PRESENT' by default
        const initialAttendance = response.data.students.reduce(
          (acc, student) => {
            acc[student.user_id] = "P";
            return acc;
          },
          {}
        );
        setAttendance(initialAttendance);
      } catch (err) {
        setError("Failed to load students for this class.");
        console.error(err);
        setStudents([]); // Clear student list on error
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchStudents();
  }, [selectedTimetableId]);

  const handleSubmit = async () => {
    // Implement your submission logic here
    alert("Submitting Attendance for timetable ID: " + selectedTimetableId);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Attendance</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="class-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Class/Section
            </label>
            <select
              id="class-select"
              value={selectedTimetableId}
              onChange={(e) => setSelectedTimetableId(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Select a Class --</option>
              {allMyClasses.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.course.name} - {session.class.name} (
                  {session.startTime})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              defaultValue={new Date().toISOString().substring(0, 10)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-center py-4">{error}</p>}

        {studentsLoading ? (
          <Spinner />
        ) : (
          <StudentAttendanceList
            students={students}
            attendance={attendance}
            setAttendance={setAttendance}
          />
        )}

        {students.length > 0 && !studentsLoading && (
          <div className="mt-6 text-right">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold"
            >
              Submit Attendance
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;

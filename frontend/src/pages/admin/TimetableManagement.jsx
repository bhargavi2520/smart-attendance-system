import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";

const daysOfWeek = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
const timeSlots = [
  "09:00:00",
  "10:00:00",
  "11:00:00",
  "12:00:00",
  "13:00:00",
  "14:00:00",
  "15:00:00",
  "16:00:00",
];

const formatTime = (timeStr) => {
  const [hour, minute] = timeStr.split(":");
  const startHour = parseInt(hour, 10);
  const endHour = startHour + 1;
  const formatHour = (h) => (h % 12 === 0 ? 12 : h % 12);
  const startAmPm = startHour < 12 ? "AM" : "PM";
  const endAmPm = endHour < 12 || endHour === 24 ? "AM" : "PM";
  return `${formatHour(startHour)}:${minute} ${startAmPm} - ${formatHour(
    endHour
  )}:${minute} ${endAmPm}`;
};

// --- NEW COMPONENT FOR EDITABLE CELLS ---
const EditableCell = ({ session, onSave, onCancel, courses, faculty }) => {
  const [editedSession, setEditedSession] = useState({
    courseId: session?.courseId || "",
    facultyId: session?.facultyId || "",
  });

  const handleSave = () => {
    onSave(editedSession);
  };

  return (
    <div className="flex flex-col space-y-2 p-1">
      <select
        value={editedSession.courseId}
        onChange={(e) =>
          setEditedSession({ ...editedSession, courseId: e.target.value })
        }
        className="w-full p-1 border border-gray-300 rounded-md text-sm"
      >
        <option value="">Select Course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </select>
      <select
        value={editedSession.facultyId}
        onChange={(e) =>
          setEditedSession({ ...editedSession, facultyId: e.target.value })
        }
        className="w-full p-1 border border-gray-300 rounded-md text-sm"
      >
        <option value="">Select Faculty</option>
        {faculty.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      <div className="flex justify-end space-x-2 mt-1">
        <button
          onClick={handleSave}
          className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default function TimetableManagement() {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingCell, setEditingCell] = useState(null); // Tracks which cell is being edited, e.g., {time, day}

  // Fetch all static data (classes, courses, faculty) on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classesRes, coursesRes, facultyRes] = await Promise.all([
          api.get("/api/classes"),
          api.get("/api/courses"),
          api.get("/api/users?role=FACULTY"),
        ]);
        setClasses(classesRes.data || []);
        setCourses(coursesRes.data || []);
        setFaculty(facultyRes.data.users || []); // The user API returns { users: [...] }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch the timetable when a class is selected (using useCallback)
  const fetchTimetable = useCallback(async () => {
    if (!selectedClassId) {
      setTimetable({});
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(
        `/api/timetables/class/${selectedClassId}`
      );
      const processedTimetable = {};
      for (const entry of data) {
        const time = entry.startTime;
        const day = entry.dayOfWeek;

        if (!processedTimetable[time]) {
          processedTimetable[time] = {};
        }
        // Store IDs for editing and names for display
        processedTimetable[time][day] = {
          courseName: entry.course?.name,
          facultyName: entry.faculty?.name,
          courseId: entry.courseId,
          facultyId: entry.facultyId,
        };
      }
      setTimetable(processedTimetable);
    } catch (error) {
      console.error("Failed to fetch timetable:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedClassId]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  // --- NEW HANDLER FOR SAVING A CELL ---
  const handleSaveCell = async (time, day, updatedSession) => {
    const payload = {
      classId: selectedClassId,
      startTime: time,
      dayOfWeek: day,
      courseId: updatedSession.courseId || null,
      facultyId: updatedSession.facultyId || null,
    };
    try {
      await api.post("/api/timetables/entry", payload);
      setEditingCell(null); // Exit edit mode
      fetchTimetable(); // Refresh the timetable data
    } catch (error) {
      console.error("Failed to save timetable entry:", error);
      // You might want to show an error toast here
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Timetable Management
        </h1>
        <p className="mt-1 text-gray-600">
          Select a class to view or edit its timetable.
        </p>
      </div>

      <div className="mb-6 max-w-md">
        <label
          htmlFor="class-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Class
        </label>
        <select
          id="class-select"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={initialLoading}
        >
          <option value="">
            {initialLoading ? "Loading..." : "Select a Class"}
          </option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.department?.name} - {cls.name} (Year: {cls.year})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        selectedClassId && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Time
                  </th>
                  {daysOfWeek.map((day) => (
                    <th
                      key={day}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((time) => {
                  if (time === "12:00:00") {
                    return (
                      <tr key="lunch" className="bg-gray-100">
                        <td
                          colSpan={daysOfWeek.length + 1}
                          className="px-6 py-4 text-center font-semibold text-gray-700"
                        >
                          Lunch Break (12:00 PM - 01:00 PM)
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={time}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatTime(time)}
                      </td>
                      {daysOfWeek.map((day) => {
                        const session = timetable[time]?.[day];
                        const isEditing =
                          editingCell?.time === time &&
                          editingCell?.day === day;
                        return (
                          <td
                            key={`${day}-${time}`}
                            className="px-2 py-2 whitespace-nowrap text-sm align-top"
                          >
                            {isEditing ? (
                              <EditableCell
                                session={session}
                                courses={courses}
                                faculty={faculty}
                                onSave={(updated) =>
                                  handleSaveCell(time, day, updated)
                                }
                                onCancel={() => setEditingCell(null)}
                              />
                            ) : (
                              <div className="relative group p-2 min-h-[60px]">
                                {session ? (
                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      {session.courseName}
                                    </p>
                                    <p className="text-gray-500">
                                      {session.facultyName}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">Free</span>
                                )}
                                <button
                                  onClick={() => setEditingCell({ time, day })}
                                  className="absolute top-1 right-1 p-1 bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ✏️
                                </button>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

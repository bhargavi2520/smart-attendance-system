import { useState, useEffect } from "react";
import api from "../../services/api";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
];

export default function TimetableManagement() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    // Fetch all classes for the dropdown
  }, []);

  useEffect(() => {
    if (selectedClass) {
      // Fetch timetable for the selected class from `/api/timetables/class/${selectedClass}`
    }
  }, [selectedClass]);

  const getSession = (day, time) => {
    // Logic to find and display the session from the timetable data
    return null; // or the session details
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Timetable Management</h1>
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="w-full md:w-1/3 p-2 border rounded-md mb-6"
      >
        <option value="">Select a Class</option>
        {/* Map classes to options */}
      </select>

      {/* Timetable grid rendering logic here */}
    </div>
  );
}

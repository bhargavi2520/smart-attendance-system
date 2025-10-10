// src/pages/faculty/AttendancePage.jsx

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import { ChevronDown, Calendar } from "lucide-react";
import "react-day-picker/dist/style.css";

import StudentAttendanceList from "./StudentAttendanceList";

const CustomDropdown = ({
  items,
  selected,
  onSelect,
  placeholder,
  getLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
        <span className="truncate text-sm">
          {selected ? getLabel(selected) : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl">
          <ul className="py-1 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer">
                {getLabel(item)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const DatePicker = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
        <span className="truncate text-sm">{format(selected, "PPP")}</span>
        <Calendar className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-auto mt-2 bg-white border border-gray-200 rounded-lg shadow-xl right-0 md:right-auto">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                onSelect(date);
              }
              setIsOpen(false);
            }}
            initialFocus
            classNames={{
              caption: "flex justify-center py-2 mb-2 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "flex items-center",
              nav_button:
                "h-6 w-6 bg-transparent hover:bg-blue-50 p-1 rounded-full",
              nav_button_previous: "absolute left-2",
              nav_button_next: "absolute right-2",
              table: "w-full border-collapse",
              head_row: "flex font-medium text-gray-900",
              head_cell: "w-8 font-normal text-sm",
              row: "flex w-full mt-2",
              cell: "text-gray-600 rounded-full h-8 w-8 text-sm p-0 text-center",
              day: "h-8 w-8 p-0 hover:bg-blue-100 rounded-full",
              day_selected:
                "bg-blue-600 text-white hover:bg-blue-700 rounded-full",
            }}
          />
        </div>
      )}
    </div>
  );
};

const AttendancePage = () => {
  const [allMyClasses, setAllMyClasses] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch all classes assigned to the logged-in faculty
  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        const response = await api.get("/api/faculty/my-classes");
        console.log("--- DATA FOR DROPDOWN ---", response.data);
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
    if (!selectedSession) {
      setStudents([]);
      setAttendance({});
      return;
    }

    const fetchStudents = async () => {
      setStudentsLoading(true);
      setError(""); // Clear previous errors

      try {
        console.log("ATTEMPTING TO FETCH STUDENTS FOR ID:", selectedSession.id);
        const response = await api.get(
          `/api/attendance/session/${selectedSession.id}/students`
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
  }, [selectedSession]);

  const handleSubmit = async () => {
    // Implement your submission logic here
    alert("Submitting Attendance for timetable ID: " + selectedSession.id);
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
              className="block text-sm font-medium text-gray-700 mb-1">
              Class/Section
            </label>
            <CustomDropdown
              items={allMyClasses}
              selected={selectedSession}
              onSelect={setSelectedSession}
              placeholder="-- Select a Class --"
              getLabel={(session) =>
                `${session.course.name} - ${session.class.name} (${session.startTime})`
              }
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <DatePicker selected={selectedDate} onSelect={setSelectedDate} />
          </div>
        </div>

        {error && <p className="text-red-500 text-center py-4">{error}</p>}

        {studentsLoading ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto">
            <StudentAttendanceList
              students={students}
              attendance={attendance}
              setAttendance={setAttendance}
            />
          </div>
        )}

        {students.length > 0 && !studentsLoading && (
          <div className="mt-6 text-right">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-semibold">
              Submit Attendance
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Calendar, BookOpen, User, Clock } from "lucide-react";

// Mock API call and data
const fetchClasses = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In a real app, this would be: const { data } = await api.get('/api/classes');
  return {
    data: {
      classes: Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `CSE-A Section ${i + 1}`,
        year: 2024,
      })),
    },
  };
};

// Based on the provided timings: 9:00 AM start, 50-min periods, 12:00-12:50 PM lunch, 4:10 PM end.
const dummyTimetable = {
  Monday: [
    { time: "9:00 - 10:00", subject: "Data Structures", faculty: "Dr. Alan" },
    { time: "10:00 - 11:00", subject: "Algorithms", faculty: "Dr. Grace" },
    { time: "11:00 - 12:00", subject: "Mathematics III", faculty: "Dr. John" },
    { time: "12:00 - 12:50", subject: "Lunch Break", faculty: "" },
    {
      time: "12:50 - 1:40",
      subject: "Operating Systems",
      faculty: "Dr. Linus",
    },
    { time: "1:40 - 2:30", subject: "OS Lab", faculty: "Dr. Linus" },
    { time: "2:30 - 3:20", subject: "DBMS", faculty: "Dr. Codd" },
    { time: "3:20 - 4:10", subject: "DBMS Lab", faculty: "Dr. Codd" },
  ],
  Tuesday: [
    { time: "9:00 - 10:00", subject: "Algorithms", faculty: "Dr. Grace" },
    { time: "10:00 - 11:00", subject: "Data Structures", faculty: "Dr. Alan" },
    { time: "11:00 - 12:00", subject: "DBMS", faculty: "Dr. Codd" },
    { time: "12:00 - 12:50", subject: "Lunch Break", faculty: "" },
    { time: "12:50 - 1:40", subject: "Mathematics III", faculty: "Dr. John" },
    { time: "1:40 - 2:30", subject: "Library", faculty: "" },
    { time: "2:30 - 3:20", subject: "Operating Systems", faculty: "Dr. Linus" },
    { time: "3:20 - 4:10", subject: "Sports", faculty: "Mr. Fit" },
  ],
  Wednesday: [
    {
      time: "9:00 - 10:00",
      subject: "Operating Systems",
      faculty: "Dr. Linus",
    },
    { time: "10:00 - 11:00", subject: "OS Lab", faculty: "Dr. Linus" },
    { time: "11:00 - 12:00", subject: "Data Structures", faculty: "Dr. Alan" },
    { time: "12:00 - 12:50", subject: "Lunch Break", faculty: "" },
    { time: "12:50 - 1:40", subject: "Algorithms", faculty: "Dr. Grace" },
    { time: "1:40 - 2:30", subject: "Algo Lab", faculty: "Dr. Grace" },
    { time: "2:30 - 3:20", subject: "Mathematics III", faculty: "Dr. John" },
    { time: "3:20 - 4:10", subject: "DBMS", faculty: "Dr. Codd" },
  ],
  // Assume Thursday and Friday have similar structures
  Thursday: [
    { time: "9:00 - 10:00", subject: "DBMS", faculty: "Dr. Codd" },
    { time: "10:00 - 11:00", subject: "DBMS Lab", faculty: "Dr. Codd" },
    { time: "11:00 - 12:00", subject: "Algorithms", faculty: "Dr. Grace" },
    { time: "12:00 - 12:50", subject: "Lunch Break", faculty: "" },
    { time: "12:50 - 1:40", subject: "Data Structures", faculty: "Dr. Alan" },
    { time: "1:40 - 2:30", subject: "DS Lab", faculty: "Dr. Alan" },
    { time: "2:30 - 3:20", subject: "Operating Systems", faculty: "Dr. Linus" },
    { time: "3:20 - 4:10", subject: "Mathematics III", faculty: "Dr. John" },
  ],
  Friday: [
    {
      time: "9:00 - 4:10",
      subject: "Industrial Visit",
      faculty: "Coordinator",
    },
  ],
};

const CustomDropdown = ({ items, selected, onSelect, placeholder }) => {
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
    <div className="relative w-full md:w-72" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
        <span className="truncate">
          {selected ? selected.name : placeholder}
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
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 cursor-pointer">
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function TimetableManagement() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getClasses = async () => {
      try {
        setLoading(true);
        const response = await fetchClasses();
        setClasses(response.data.classes || []);
      } catch (err) {
        setError("Failed to fetch classes.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getClasses();
  }, []);

  return (
    <div className="p-2 md:p-4 bg-gray-50 min-h-full">
      <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Timetable Management
          </h1>
          <p className="text-gray-600 mt-1">
            View, create, or update class timetables.
          </p>
        </div>
        <div className="flex-shrink-0">
          {loading ? (
            <div className="h-12 w-72 bg-gray-200 rounded-lg animate-pulse" />
          ) : (
            <CustomDropdown
              items={classes}
              selected={selectedClass}
              onSelect={setSelectedClass}
              placeholder="Select a class to view"
            />
          )}
        </div>
      </header>

      {error && <p className="text-center text-red-500">{error}</p>}

      <main className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {selectedClass ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
              Timetable for {selectedClass.name}
            </h2>
            <div className="mt-6 overflow-x-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-1 min-w-[800px]">
                {Object.entries(dummyTimetable).map(([day, periods]) => (
                  <div key={day} className="flex flex-col">
                    <div className="p-3 bg-gray-100 text-gray-800 font-semibold text-center rounded-t-lg">
                      {day}
                    </div>
                    <div className="flex-grow space-y-1 bg-gray-50 p-2 rounded-b-lg">
                      {periods.map((period, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-md ${
                            period.subject.toLowerCase().includes("break")
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-50 text-blue-900"
                          }`}>
                          <p className="font-bold text-sm truncate">
                            {period.subject}
                          </p>
                          {period.faculty && (
                            <p className="text-xs flex items-center mt-1 opacity-80">
                              <User className="w-3 h-3 mr-1.5" />
                              {period.faculty}
                            </p>
                          )}
                          <p className="text-xs flex items-center mt-1 opacity-80">
                            <Clock className="w-3 h-3 mr-1.5" />
                            {period.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-700">
              No Class Selected
            </h3>
            <p className="text-gray-500 mt-1">
              Please select a class from the dropdown to view its timetable.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

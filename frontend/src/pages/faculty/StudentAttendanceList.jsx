// src/pages/faculty/StudentAttendanceList.jsx

import React from "react";

const StudentAttendanceList = ({ students, attendance, setAttendance }) => {
  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  if (students.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        Select a class to see the student list or no students are enrolled.
      </p>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Avatar
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Student Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Email
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {students.map((student) => (
          <tr key={student.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <img
                className="h-10 w-10 rounded-full"
                src={`https://i.pravatar.cc/150?u=${student.id}`}
                alt=""
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-medium">
              {student.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
              {student.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center space-x-2">
                {["P", "A", "OD"].map((status) => {
                  const statusMap = {
                    P: { text: "Present", color: "green" },
                    A: { text: "Absent", color: "red" },
                    OD: { text: "On Duty", color: "yellow" },
                  };
                  const isActive = attendance[student.id] === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(student.id, status)}
                      className={`px-2 py-1 text-xs font-semibold rounded-full border-2 ${
                        isActive
                          ? `bg-${statusMap[status].color}-500 border-${statusMap[status].color}-500 text-white`
                          : `bg-white border-gray-300 text-gray-500 hover:bg-gray-100`
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentAttendanceList;

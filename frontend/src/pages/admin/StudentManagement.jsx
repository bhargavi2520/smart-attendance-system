import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import { PlusCircle, Search, Edit, Trash2 } from "lucide-react";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // The backend now provides all the necessary details with this single call
      const { data } = await api.get("/api/users?role=student");
      setStudents(data.users || []);
    } catch (err) {
      setError("Failed to fetch students.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await api.delete(`/api/users/${id}`);
        setStudents((prevStudents) => prevStudents.filter((s) => s.id !== id));
      } catch (err) {
        alert("Failed to delete student.");
        console.error(err);
      }
    }
  };

  const filteredStudents = students.filter((student) => {
    const query = searchTerm.toLowerCase();
    const name = student.name?.toLowerCase() || "";
    const email = student.email?.toLowerCase() || "";
    const rollNumber = student.studentProfile?.rollNumber?.toLowerCase() || "";

    return (
      name.includes(query) ||
      email.includes(query) ||
      rollNumber.includes(query)
    );
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 md:p-8 bg-white min-h-full">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <Link
          to="/admin/users/add"
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors w-full md:w-auto"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Student
        </Link>
      </div>

      <div className="mb-6 relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name, email, or roll number..."
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Roll Number
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Department
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Class
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.studentProfile?.rollNumber || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.studentProfile?.class?.department?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.studentProfile?.class?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                  <Link
                    to={`/admin/users/edit/${student.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteHandler(student.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && !loading && (
          <div className="text-center p-12">
            <h3 className="text-lg font-semibold text-gray-700">
              No Matching Students Found
            </h3>
            <p className="text-gray-500 mt-1">
              Try adjusting your search term or add a new student.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

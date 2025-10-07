// src/pages/admin/ClassList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";

export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const { data } = await api.get("/api/classes");
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch classes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await api.delete(`/api/classes/${id}`);
        fetchClasses(); // Re-fetch classes to update the list
      } catch (err) {
        alert("Failed to delete class.");
      }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Class Management</h1>
        <Link
          to="/admin/classes/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Class
        </Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Table from your original file goes here, but with a working delete button */}
        <table className="min-w-full divide-y divide-gray-200">
          {/* ...thead... */}
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((cls) => (
              <tr key={cls.id}>
                {/* ...other tds... */}
                <td className="px-6 py-4 space-x-4 text-sm font-medium">
                  <Link
                    to={`/admin/classes/edit/${cls.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteHandler(cls.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

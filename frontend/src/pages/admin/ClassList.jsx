import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import { Edit, Trash2, PlusCircle, Search } from "lucide-react";

export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClasses = async () => {
    setLoading(true);
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
    if (
      window.confirm(
        "Are you sure you want to delete this class? This action cannot be undone."
      )
    ) {
      try {
        await api.delete(`/api/classes/${id}`);
        setClasses((prevClasses) => prevClasses.filter((c) => c.id !== id));
      } catch (err) {
        alert("Failed to delete class.");
        console.error(err);
      }
    }
  };

  const filteredClasses = classes.filter((cls) => {
    const name = cls.name?.toLowerCase() || "";
    const department = cls.department?.name?.toLowerCase() || "";
    const inCharge = cls.inCharge?.name?.toLowerCase() || "";
    const query = searchTerm.toLowerCase();
    return (
      name.includes(query) ||
      department.includes(query) ||
      inCharge.includes(query)
    );
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-white min-h-full">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
        <Link
          to="/admin/classes/add"
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors w-full md:w-auto"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Class
        </Link>
      </div>

      <div className="mb-6 relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search classes by name, department, or in-charge..."
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
                Class Name
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
                Year
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                In-Charge
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
            {filteredClasses.map((cls) => (
              <tr key={cls.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {cls.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cls.department?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cls.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cls.inCharge?.name || "Not Assigned"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                  <Link
                    to={`/admin/classes/edit/${cls.id}`}
                    className="text-blue-600 hover:text-blue-900"
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
        {filteredClasses.length === 0 && !loading && (
          <div className="text-center p-12">
            <h3 className="text-lg font-semibold text-gray-700">
              No Matching Classes Found
            </h3>
            <p className="text-gray-500 mt-1">
              Try adjusting your search term or add a new class.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

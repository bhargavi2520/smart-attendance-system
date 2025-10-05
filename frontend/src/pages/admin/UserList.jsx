import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import useAuth from "../../hooks/useAuth";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (user) {
        try {
          // 1. Fixed the address to start with "/api"
          const { data } = await api.get("/api/users");

          // 2. Used the correct "data" variable
          setUsers(data.users || []);
        } catch (err) {
          setError("Failed to fetch users.");
          console.error("Error details:", err); // Logs the actual error to the console
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        alert("Failed to delete user.");
      }
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <Link
          to="/admin/users/add"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add User
        </Link>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Roles
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Roll Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.roles?.map((role) => role.name).join(", ")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.studentProfile?.rollNumber || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.facultyProfile?.department || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  to={`/admin/users/edit/${user.id}`}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteHandler(user.id)}
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
  );
}

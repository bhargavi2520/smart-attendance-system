import { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";

export default function FacultyManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: usersData } = await api.get("/api/users");
        // const { data: rolesData } = await api.get("/api/roles");
        const facultyAndStaff = usersData.filter((user) =>
          user.roles.some((role) => role.name !== "STUDENT")
        );
        setUsers(facultyAndStaff);
        // setRoles(rolesData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Faculty Management</h1>
        <p className="mt-1 text-gray-600">
          Manage faculty details and assign roles within the institution.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Faculty Roles</h2>
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table implementation from your UserList.jsx */}
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Assign Roles</h2>
        <form className="space-y-4">
          {/* Form implementation for assigning roles */}
        </form>
      </div>
    </div>
  );
}

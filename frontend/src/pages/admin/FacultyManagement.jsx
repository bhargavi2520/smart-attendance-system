import { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";
import { Search, Edit3, Trash2, UserPlus } from "lucide-react";

// A helper to assign colors to roles for better UI
const roleColorMap = {
  ADMIN: "bg-red-100 text-red-800",
  PRINCIPAL: "bg-purple-100 text-purple-800",
  HOD: "bg-blue-100 text-blue-800",
  FACULTY: "bg-green-100 text-green-800",
  "CLASS IN-CHARGE": "bg-yellow-100 text-yellow-800",
  STUDENT: "bg-gray-100 text-gray-800",
};

const RoleBadge = ({ role }) => (
  <span
    className={`px-2 py-1 text-xs font-semibold rounded-full ${
      roleColorMap[role] || "bg-gray-100 text-gray-800"
    }`}
  >
    {role.replace(/_/g, " ")}
  </span>
);

export default function FacultyManagement() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State for the "Add New Faculty" form
  const [newFacultyName, setNewFacultyName] = useState("");
  const [newFacultyEmail, setNewFacultyEmail] = useState("");
  const [newFacultyDept, setNewFacultyDept] = useState("");

  // State for the "Manage User Roles" form
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, deptsRes, rolesRes] = await Promise.all([
        api.get("/api/users"),
        api.get("/api/departments"),
        api.get("/api/roles"),
      ]);

      const allUsers = usersRes.data.users || [];
      // CORRECTED: Filter out users who have the "STUDENT" role.
      const facultyAndStaff = allUsers.filter(
        (user) => !user.roles.some((role) => role.name === "STUDENT")
      );

      setUsers(facultyAndStaff);
      setDepartments(deptsRes.data || []);
      setAllRoles(rolesRes.data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      if (err.response) console.error("Error Response:", err.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const currentUserRoles = selectedUser.roles.map((role) => role.name);
      setSelectedUserRoles(currentUserRoles);
    } else {
      setSelectedUserRoles([]);
    }
  }, [selectedUser]);

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/users", {
        name: newFacultyName,
        email: newFacultyEmail,
        password: "Password123", // A secure default password is set
        role: "FACULTY",
        departmentId: newFacultyDept,
        designation: "Faculty", // A default designation
      });
      setNewFacultyName("");
      setNewFacultyEmail("");
      setNewFacultyDept("");
      fetchData(); // Refresh the user list
    } catch (error) {
      alert("Failed to add faculty. Please check the console for details.");
      console.error(error.response?.data?.message || error.message);
    }
  };

  const handleUpdateRoles = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await api.put(`/api/users/${selectedUser.id}/roles`, {
        roles: selectedUserRoles,
      });
      alert("Roles updated successfully!");
      fetchData(); // Refresh the user list
    } catch (error) {
      alert("Failed to update roles. Please check the console for details.");
      console.error(error.response?.data?.message || error.message);
    }
  };

  const handleRoleCheckboxChange = (roleName) => {
    setSelectedUserRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Faculty & Role Management
        </h1>
        <p className="mt-1 text-gray-600">
          Manage faculty, roles, and assignments within the institution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Faculty & User List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Faculty & Staff List
          </h2>
          <div className="mb-4 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Roles
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.facultyProfile?.department?.name || "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <RoleBadge key={role.name} role={role.name} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Roles"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 2: Add & Manage Forms */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Faculty
            </h2>
            <form onSubmit={handleAddFaculty} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newFacultyName}
                  onChange={(e) => setNewFacultyName(e.target.value)}
                  required
                  className="mt-1 w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newFacultyEmail}
                  onChange={(e) => setNewFacultyEmail(e.target.value)}
                  required
                  className="mt-1 w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  value={newFacultyDept}
                  onChange={(e) => setNewFacultyDept(e.target.value)}
                  required
                  className="mt-1 w-full p-2 border rounded-md"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <UserPlus size={18} className="mr-2" />
                Add Faculty
              </button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Manage User Roles
            </h2>
            <form onSubmit={handleUpdateRoles} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select User
                </label>
                <select
                  value={selectedUser ? selectedUser.id : ""}
                  onChange={(e) =>
                    setSelectedUser(
                      users.find((u) => u.id === parseInt(e.target.value))
                    )
                  }
                  className="mt-1 w-full p-2 border rounded-md"
                >
                  <option value="">-- Select a user --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign/Remove Roles
                  </label>
                  <div className="space-y-2">
                    {allRoles.map((role) => (
                      <div key={role.id} className="flex items-center">
                        <input
                          id={`role-${role.id}`}
                          type="checkbox"
                          checked={selectedUserRoles.includes(role.name)}
                          onChange={() => handleRoleCheckboxChange(role.name)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`role-${role.id}`}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          {role.name.replace(/_/g, " ")}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={!selectedUser}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Update Roles
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

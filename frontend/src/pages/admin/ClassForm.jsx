// src/pages/admin/ClassForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";

export default function ClassForm() {
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [inchargeId, setInchargeId] = useState("");

  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments and faculty for the dropdowns
        const [deptsRes, facultyRes] = await Promise.all([
          api.get("/api/departments"),
          api.get("/api/users?role=FACULTY"), // Assuming an endpoint to get users by role
        ]);
        setDepartments(deptsRes.data);
        setFaculty(facultyRes.data.users);

        if (id) {
          // If editing, fetch the class data
          const { data: classData } = await api.get(`/api/classes/${id}`);
          setName(classData.name);
          setDepartmentId(classData.departmentId);
          setYear(classData.year);
          setInchargeId(classData.inchargeId || "");
        }
      } catch (error) {
        console.error("Failed to fetch form data", error);
        alert("Failed to load necessary data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const classData = {
      name,
      departmentId,
      year,
      inchargeId: inchargeId || null,
    };

    try {
      if (id) {
        await api.put(`/api/classes/${id}`, classData);
      } else {
        await api.post("/api/classes", classData);
      }
      navigate("/admin/classes");
    } catch (error) {
      alert("Failed to save class. Check console for details.");
      console.error(error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        {id ? "Edit Class" : "Create New Class"}
      </h1>
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-gray-700">Class Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded p-2"
            placeholder="e.g., Section A"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Department</label>
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
            className="w-full border rounded p-2"
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            Class In-Charge (Optional)
          </label>
          <select
            value={inchargeId}
            onChange={(e) => setInchargeId(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select Faculty --</option>
            {faculty.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Class
          </button>
          <Link to="/admin/classes" className="ml-4 text-gray-600">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

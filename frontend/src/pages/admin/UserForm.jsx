import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export default function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [department, setDepartment] = useState(""); // Default to empty
  const [designation, setDesignation] = useState(""); // For faculty
  const [classId, setClassId] = useState(""); // For students
  const [classes, setClasses] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch classes for the student dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await api.get("/api/classes");
        setClasses(data);
      } catch (err) {
        console.error("Could not fetch classes", err);
      }
    };
    if (role === "STUDENT") {
      fetchClasses();
    }
  }, [role]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const userData = { name, email, password, role };
      if (role === "STUDENT") {
        userData.rollNumber = rollNumber;
        userData.classId = classId;
      } else {
        userData.department = department;
        userData.designation = designation;
      }

      if (id) {
        // --- FIX: Correct API path ---
        await api.put(`/api/users/${id}`, userData);
      } else {
        // --- FIX: Correct API path ---
        await api.post("/api/users", userData);
      }
      navigate("/admin/students");
    } catch (error) {
      alert("Failed to save user. Check console for details.");
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        {id ? "Edit User" : "Add New User"}
      </h1>
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label>Password {id ? "(Leave blank to keep same)" : ""}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!id}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="STUDENT">STUDENT</option>
            <option value="FACULTY">FACULTY</option>
            <option value="INCHARGE">INCHARGE</option>
            <option value="HOD">HOD</option>
            <option value="PRINCIPAL">PRINCIPAL</option>
          </select>
        </div>

        {/* Conditional Fields based on Role */}
        {role === "STUDENT" ? (
          <>
            <div className="mb-4">
              <label>Roll Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label>Class</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                required
                className="w-full border rounded p-2"
              >
                <option value="">-- Select Class --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label>Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label>Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
                className="w-full border rounded p-2"
              />
            </div>
          </>
        )}

        <div className="flex items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save User
          </button>
          <Link to="/admin/students" className="ml-4 text-gray-600">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

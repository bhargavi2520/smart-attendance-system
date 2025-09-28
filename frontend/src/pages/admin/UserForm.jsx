import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export default function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [department, setDepartment] = useState("Computer Science");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        const { data } = await api.get(`/users/${id}`); // Note: This endpoint doesn't exist yet, we'll add it
        setName(data.name);
        setEmail(data.email);
        setRollNumber(data.rollNumber || "");
        setRole(data.role);
        setDepartment(data.department || "");
      };
      // For now, let's assume we fetch all users on the list page
      // and pass the user to edit via state or fetch single user.
      // To keep it simple, we'll create only.
    }
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/users/${id}`, {
          name,
          email,
          rollNumber,
          password,
          role,
          department,
        });
      } else {
        await api.post("/users", {
          name,
          email,
          rollNumber,
          password,
          role,
          department,
        });
      }
      navigate("/admin/users");
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
        {/* Add form fields for name, email, rollNumber, password, role, department */}
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
          <label>Roll Number (optional)</label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
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
        <div className="mb-4">
          <label>Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="flex items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save User
          </button>
          <Link to="/admin/users" className="ml-4 text-gray-600">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";

// The form now accepts an `onSuccess` prop
export default function UserForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT"); // Default to student
  const [rollNumber, setRollNumber] = useState("");
  const [classId, setClassId] = useState("");

  // State for dropdowns
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormData = async () => {
      setLoading(true);
      try {
        const { data: classData } = await api.get("/api/classes");
        setClasses(classData);

        if (id) {
          const { data: userData } = await api.get(`/api/users/${id}`);
          setName(userData.name);
          setEmail(userData.email);
          setRollNumber(userData.studentProfile?.rollNumber || "");
          setClassId(userData.studentProfile?.classId || "");
          // You can expand this to handle other roles if needed
        }
      } catch (error) {
        console.error("Failed to fetch form data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      password: password || undefined, // Don't send empty password
      role,
      rollNumber,
      classId,
    };

    try {
      if (id) {
        await api.put(`/api/users/${id}`, userData);
      } else {
        await api.post("/api/users", userData);
      }

      // If the onSuccess prop is provided, call it.
      if (onSuccess) {
        onSuccess();
      } else {
        // Otherwise, navigate away as before.
        navigate("/admin/students");
      }
    } catch (error) {
      alert("Failed to save user. Check console for details.");
      console.error(error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        {id ? "Edit Student" : "Add New Student"}
      </h1>
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Roll Number
          </label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Class
          </label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select a Class --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password {id ? "(Leave blank to keep same)" : ""}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!id}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {id ? "Update Student" : "Save Student"}
          </button>
          {/* We don't need a cancel button inside the modal, the 'X' is enough */}
        </div>
      </form>
    </div>
  );
}

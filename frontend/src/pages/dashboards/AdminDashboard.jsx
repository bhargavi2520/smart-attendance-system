import { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";

// Import the forms that will be used in the modals
import ClassForm from "../admin/ClassForm";
import UserForm from "../admin/UserForm";

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    {icon}
    <div className="ml-4">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  </div>
);

// A reusable Modal component
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // State to control the visibility of the modals
  const [showClassModal, setShowClassModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/api/dashboard/stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard statistics.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // This function will be called from the form when it successfully submits
  const handleFormSuccess = () => {
    setShowClassModal(false);
    setShowStudentModal(false);
    // Re-fetch the stats to update the dashboard cards
    fetchStats();
  };

  if (loading) return <Spinner />;

  return (
    <>
      <div className="p-8 bg-gray-50 min-h-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Classes" value={stats?.totalClasses || 0} />
          <StatCard title="Total Students" value={stats?.totalStudents || 0} />
          <StatCard title="Total Faculty" value={stats?.totalFaculty || 0} />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Quick Actions
          </h2>
          <div className="flex space-x-4">
            {/* This is now a button that sets state to show the modal */}
            <button
              onClick={() => setShowClassModal(true)}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Create New Class
            </button>
            {/* This button shows the student form modal */}
            <button
              onClick={() => setShowStudentModal(true)}
              className="px-4 py-2 bg-white text-gray-700 font-semibold border rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Add New Student
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">
            System Overview
          </h2>
          <p className="text-gray-500 mt-2">
            Charts and graphs will be displayed here.
          </p>
        </div>
      </div>

      {/* Conditional rendering of the modals based on state */}
      {showClassModal && (
        <Modal onClose={() => setShowClassModal(false)}>
          <ClassForm onSuccess={handleFormSuccess} />
        </Modal>
      )}

      {showStudentModal && (
        <Modal onClose={() => setShowStudentModal(false)}>
          <UserForm onSuccess={handleFormSuccess} />
        </Modal>
      )}
    </>
  );
}

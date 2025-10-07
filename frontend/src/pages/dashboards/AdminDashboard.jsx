// src/pages/dashboards/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/ui/Spinner";

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchStats();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Classes" value={stats?.totalClasses || 0} />
        <StatCard
          title="Total Students"
          value={
            stats?.totalUsers ? stats.totalUsers - (stats.totalFaculty || 0) : 0
          }
        />
        <StatCard title="Total Faculty" value={stats?.totalFaculty || 0} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Quick Actions
        </h2>
        <div className="flex space-x-4">
          <Link
            to="/admin/classes/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Class
          </Link>
          <Link
            to="/admin/users/add"
            className="px-4 py-2 bg-white text-gray-700 border rounded-md hover:bg-gray-50"
          >
            Add New Student
          </Link>
        </div>
      </div>

      {/* Placeholder for System Overview charts */}
    </div>
  );
}

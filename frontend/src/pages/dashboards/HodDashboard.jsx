import { useState, useEffect } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import AttendanceBarChart from "../../components/charts/AttendanceBarChart";
import { Percent, Users, BarChart } from "lucide-react";

const HodDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/analytics/department");
        setStats(response.data);
      } catch (err) {
        setError("Failed to fetch department statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  const chartData =
    stats?.classAnalytics.map((c) => ({
      name: c.courseName,
      percentage: c.percentage,
    })) || [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Department Dashboard ({stats?.department})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <Percent className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Overall Attendance
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.overallPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Users className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalClasses}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <BarChart className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Classes Monitored
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.classAnalytics.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <AttendanceBarChart
          data={chartData}
          barKey="percentage"
          xAxisKey="name"
          title="Attendance Percentage by Class"
        />
      </Card>
    </div>
  );
};

export default HodDashboard;

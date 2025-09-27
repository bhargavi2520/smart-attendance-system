import { useState, useEffect } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import AttendanceBarChart from "../../components/charts/AttendanceBarChart";
import { Building, Percent } from "lucide-react";

const PrincipalDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/analytics/institution");
        setStats(response.data);
      } catch (err) {
        setError("Failed to fetch institution statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  const chartData =
    stats?.departmentStats.map((d) => ({
      name: d.department,
      percentage: d.percentage,
    })) || [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Institution Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <Percent className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Institution-Wide Attendance
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
              <Building className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Departments Monitored
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.departmentStats.length}
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
          title="Attendance by Department"
        />
      </Card>
    </div>
  );
};

export default PrincipalDashboard;

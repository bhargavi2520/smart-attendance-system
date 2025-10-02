// File: src/pages/dashboards/faculty/RecentAttendance.jsx

import Card from "../../components/ui/Card";
import { Download, MoreVertical } from "lucide-react";

const RecentAttendance = ({ actions }) => {
  if (!actions || actions.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Attendance Actions</h2>
        <Card className="p-4 text-center text-gray-500">
          <p>No recent attendance actions.</p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Recent Attendance Actions</h2>
      <div className="space-y-3">
        {actions.map((action) => (
          <Card key={action.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  {action.courseName} - {action.section}
                </p>
                <p className="text-sm text-gray-500">{action.takenAt} (1hr)</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    {action.present}/{action.total}
                  </p>
                  <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: `${action.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <Download className="w-5 h-5 text-gray-500 cursor-pointer" />
                <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default RecentAttendance;

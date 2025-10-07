// File: src/pages/dashboards/faculty/ClassSchedule.jsx

import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { Clock, ChevronRight } from "lucide-react";

const ClassSchedule = ({ classes }) => {
  if (!classes || classes.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4">Class Schedule & Actions</h2>
        <Card className="p-4 text-center text-gray-500">
          <p>No classes scheduled for today.</p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Class Schedule & Actions</h2>
      <div className="space-y-4">
        {classes.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-shadow">
            <Link to={`/mark-attendance/${session.id}`} className="block p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-indigo-600">
                    {session.Course?.courseName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {session.Course?.courseCode}
                  </p>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      {session.startTime} - {session.endTime}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-indigo-500">
                  <span>Start Session</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ClassSchedule;

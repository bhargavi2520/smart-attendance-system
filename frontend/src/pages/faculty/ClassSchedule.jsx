// File: src/pages/faculty/ClassSchedule.jsx (Mobile Responsive)
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { Clock, ChevronRight } from "lucide-react";

const ClassSchedule = ({ classes }) => {
  if (!classes || classes.length === 0) {
    return (
      <section>
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
          Class Schedule & Actions
        </h2>
        <Card className="p-4 text-center text-gray-500">
          <p className="text-sm sm:text-base">
            No classes scheduled for today.
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
        Class Schedule & Actions
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {classes.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-shadow">
            <Link
              to={`/mark-attendance/${session.id}`}
              className="block p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-base sm:text-lg font-semibold text-indigo-600 truncate">
                    {session.Course?.courseName}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {session.Course?.courseCode}
                  </p>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 mt-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span>
                      {session.startTime} - {session.endTime}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end sm:justify-start space-x-2 text-indigo-500 text-sm sm:text-base">
                  <span className="font-medium">Start Session</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
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

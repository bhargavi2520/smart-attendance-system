// This is a placeholder for a more detailed view.
// The dashboard already provides a good summary.
import { Link } from "react-router-dom";

const MyAttendance = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Detailed Attendance View
      </h1>
      <p>This page can be used to show a day-by-day log for each subject.</p>
      <Link to="/" className="text-indigo-600 hover:underline">
        &larr; Back to Dashboard
      </Link>
    </div>
  );
};

export default MyAttendance;

// File: src/pages/dashboards/faculty/SubjectSummary.jsx

import Card from "../../components/ui/Card";
// You might need to install a library for the chart: npm install react-circular-progressbar
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const SubjectSummary = ({ summary }) => {
  if (!summary || summary.length === 0) {
    return (
      <section className="col-span-full">
        <h2 className="text-xl font-semibold mb-4">
          Subject-wise Attendance Summary
        </h2>
        <Card className="p-4 text-center text-gray-500">
          <p>No attendance summary available.</p>
        </Card>
      </section>
    );
  }

  return (
    <section className="col-span-full">
      <h2 className="text-xl font-semibold mb-4">
        Subject-wise Attendance Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summary.map((item) => (
          <Card
            key={item.id}
            className="p-4 flex flex-col items-center justify-center"
          >
            <div style={{ width: 100, height: 100 }}>
              <CircularProgressbar
                value={item.percentage}
                text={`${item.percentage}%`}
                styles={buildStyles({
                  textColor: "#111827",
                  pathColor: "#4f46e5",
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
            <p className="font-semibold mt-3">{item.courseName}</p>
            <p className="text-sm text-gray-500">{item.section}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};
export default SubjectSummary;

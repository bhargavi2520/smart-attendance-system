// File: backend/controllers/facultyController.js

// @desc    Get recent attendance actions for the faculty dashboard
// @route   GET /api/faculty/attendance/recent
// @access  Private (Faculty)
exports.getRecentAttendance = async (req, res) => {
  try {
    // TODO: Replace with real database query
    // This query would find the last 5 attendance sessions taken by req.user.id,
    // join with courses and count students.
    const recentActions = [
      {
        id: 1,
        courseName: "Data Structures",
        section: "CSE-B",
        takenAt: "10:30 AM",
        present: 42,
        total: 45,
        percentage: 93,
      },
      {
        id: 2,
        courseName: "Operating Systems",
        section: "IT-A",
        takenAt: "1:00 PM",
        present: 35,
        total: 50,
        percentage: 70,
      },
      {
        id: 3,
        courseName: "Intro to Programming",
        section: "CSE-A",
        takenAt: "9:00 AM",
        present: 48,
        total: 60,
        percentage: 80,
      },
    ];
    res.json(recentActions);
  } catch (error) {
    console.error("Error fetching recent attendance:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get subject-wise attendance summary for the faculty dashboard
// @route   GET /api/faculty/attendance/summary
// @access  Private (Faculty)
exports.getSubjectWiseSummary = async (req, res) => {
  try {
    // TODO: Replace with real database query
    // This query would calculate the overall average attendance for each course
    // taught by req.user.id.
    const summary = [
      {
        id: 1,
        courseName: "Intro to Programming",
        section: "Section A",
        percentage: 92,
      },
      {
        id: 2,
        courseName: "Data Structures",
        section: "Section B",
        percentage: 85,
      },
      {
        id: 3,
        courseName: "Operating Systems",
        section: "Section A",
        percentage: 95,
      },
    ];
    res.json(summary);
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

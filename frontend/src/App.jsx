import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import SelectRole from "./pages/SelectRole";

// Shared Pages
import Dashboard from "./pages/Dashboard";

// Student Pages
import MyAttendance from "./pages/student/MyAttendance";

// Faculty Pages
import AttendancePage from "./pages/faculty/AttendancePage";
import MarkAttendance from "./pages/faculty/MarkAttendance";
import FacultyReportsPage from "./pages/faculty/FacultyReportsPage";
import FacultySettingsPage from "./pages/faculty/FacultySettingsPage";

// Admin Pages
import UserList from "./pages/admin/UserList";
import UserForm from "./pages/admin/UserForm";
import ClassList from "./pages/admin/ClassList";
// ... import other admin pages as you create them (ClassForm, DepartmentList, etc.)

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/select-role"
        element={
          <ProtectedRoute>
            <SelectRole />
          </ProtectedRoute>
        }
      />

      {/* Main Protected Application */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Shared Dashboard Route */}
        <Route index element={<Dashboard />} />
        <Route path="settings" element={<FacultySettingsPage />} />

        {/* Student Routes */}
        <Route
          path="my-attendance"
          element={
            <ProtectedRoute roles={["student"]}>
              <MyAttendance />
            </ProtectedRoute>
          }
        />

        {/* Faculty & Staff Routes */}
        <Route
          path="attendance"
          element={
            <ProtectedRoute roles={["faculty", "hod", "principal"]}>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="mark-attendance/:timetableId"
          element={
            <ProtectedRoute roles={["faculty"]}>
              <MarkAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute roles={["faculty", "hod", "principal"]}>
              <FacultyReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - NESTED INSIDE THE MAIN LAYOUT */}
        <Route
          path="admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users/add"
          element={
            <ProtectedRoute roles={["admin"]}>
              <UserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users/edit/:id"
          element={
            <ProtectedRoute roles={["admin"]}>
              <UserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/classes"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ClassList />
            </ProtectedRoute>
          }
        />
        {/* Add other admin routes here */}
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

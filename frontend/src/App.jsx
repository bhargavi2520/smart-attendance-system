import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyAttendance from "./pages/student/MyAttendance";
import MarkAttendance from "./pages/faculty/MarkAttendance";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserList from "./pages/admin/UserList";
import UserForm from "./pages/admin/UserForm";
import SelectRole from "./pages/SelectRole"; // Import the new component

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

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Student Routes */}
        <Route
          path="my-attendance"
          element={
            <ProtectedRoute roles={["student"]}>
              <MyAttendance />
            </ProtectedRoute>
          }
        />

        {/* Faculty Routes */}
        <Route
          path="mark-attendance/:timetableId"
          element={
            <ProtectedRoute roles={["faculty"]}>
              <MarkAttendance />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
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
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
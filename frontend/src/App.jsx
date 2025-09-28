import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyAttendance from "./pages/student/MyAttendance";
import MarkAttendance from "./pages/faculty/MarkAttendance";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword"; // <-- ADD IMPORT
import ResetPassword from "./pages/ResetPassword"; // <-- ADD IMPORT
import UserList from "./pages/admin/UserList";
import UserForm from "./pages/admin/UserForm";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />{" "}
      {/* <-- ADD ROUTE */}
      <Route path="/reset-password/:token" element={<ResetPassword />} />{" "}
      {/* <-- ADD ROUTE */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route
          path="my-attendance"
          element={
            <ProtectedRoute roles={["STUDENT"]}>
              <MyAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="mark-attendance/:timetableId"
          element={
            <ProtectedRoute roles={["FACULTY"]}>
              <MarkAttendance />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="my-attendance" /* ... */ />
        <Route path="mark-attendance/:timetableId" /* ... */ />

        {/* ADMIN ROUTES */}
        <Route
          path="admin/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users/add"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users/edit/:id"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UserForm />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

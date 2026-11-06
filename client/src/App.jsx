import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/common/ProtectedRoute";
import GuestRoute from "./components/common/GuestRoute";
import AdminRoute from "./components/problems/AdminRoute";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Problems from "./pages/Problems";
import ProblemDetails from "./pages/ProblemDetails";
import AdminProblems from "./pages/AdminProblems";
import AdminProblemForm from "./pages/AdminProblemForm";
import SubmissionHistory from "./pages/SubmissionHistory";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import DashboardLayout from "./components/layout/DashboardLayout";

const PlaceholderPage = ({ title }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#0b1120]">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          This module is coming soon.
        </p>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />

            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/problems"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Problems />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/problems/:slug"
              element={
                <ProtectedRoute>
                  <ProblemDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/submissions"
              element={
                <ProtectedRoute>
                  <SubmissionHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/problems"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminProblems />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/problems/new"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminProblemForm />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/problems/:id/edit"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminProblemForm />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={<PlaceholderPage title="404 - Page Not Found" />}
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import ProjectChat from "./pages/ProjectChat";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import this
import type { JSX } from "react/jsx-dev-runtime";

// --- Protected Route Component ---
// This redirects to "/" if not logged in
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        Loading...
      </div>
    );

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Wrap everything */}
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route
            path="/"
            element={<LandingPage />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
            <Route
              index
              element={<ProjectChat />}
            />
          </Route>

          {/* Fallback */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

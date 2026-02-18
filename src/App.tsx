import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import ProjectChat from "./pages/ProjectChat";
import { AuthProvider, useAuth } from "./context/AuthContext";
import type { JSX } from "react/jsx-dev-runtime";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";

// --- Protected Route Component ---
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
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
      <BrowserRouter>
        <Routes>
          {/* 1. Public Zone */}
          <Route
            path="/"
            element={<LandingPage />}
          />
          <Route
            path="/privacy"
            element={<Privacy />}
          />
          <Route
            path="/terms"
            element={<Terms />}
          />
          <Route
            path="/cookies"
            element={<Cookies />}
          />

          {/* 2. Private Zone (The App) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
            {/* A. Index Route: /dashboard 
               Renders ProjectChat with no ID (Empty State)
            */}
            <Route
              index
              element={<ProjectChat />}
            />

            {/* B. Dynamic Route: /dashboard/project/123 
               Renders ProjectChat WITH an ID.
               CRITICAL: This matches the navigate() call in your Sidebar!
            */}
            <Route
              path="project/:projectId"
              element={<ProjectChat />}
            />
          </Route>

          {/* 3. Catch-all (404) */}
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

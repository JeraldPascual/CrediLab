import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import ActivitiesView from "./pages/ActivitiesView";
import LeaderboardView from "./pages/LeaderboardView";
import ProfilePage from "./pages/ProfilePage";
import ProblemPage from "./pages/ProblemPage";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

            {/* Protected dashboard (SPA shell with sidebar) */}
            <Route
              path="/student"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            >
              {/* Default view: Activities */}
              <Route index element={<ActivitiesView />} />
              <Route path="leaderboard" element={<LeaderboardView />} />
              <Route path="information" element={<ProfilePage />} />
            </Route>

            {/* Challenge pages (also protected, rendered inside dashboard shell) */}
            <Route
              path="/problem"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProblemPage />} />
              <Route path=":challengeId" element={<ProblemPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

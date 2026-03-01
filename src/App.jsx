import { useEffect } from "react";
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
import CodingPortal from "./pages/CodingPortal";
import WalletGuidePage from "./pages/WalletGuidePage";
import AchievementsPage from "./pages/AchievementsPage";
import TransactionsPage from "./pages/TransactionsPage";
import CheatingLogsPage from "./pages/CheatingLogsPage";
import VerifyCertPage from "./pages/VerifyCertPage";
import WeeklyTaskPage from "./pages/WeeklyTaskPage";
import CommunityFeed from "./pages/CommunityFeed";

export default function App() {
  // Disable right-click context menu site-wide to discourage accidental DevTools access.
  // Note: this is a UX nudge, not a security measure.
  useEffect(() => {
    const block = (e) => e.preventDefault();
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/verify/:hash" element={<VerifyCertPage />} />

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
              <Route path="help-center" element={<WalletGuidePage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="cheating-logs" element={<CheatingLogsPage />} />
              <Route path="community" element={<CommunityFeed />} />
            </Route>

            {/* Challenge list (inside dashboard shell) */}
            <Route
              path="/problem"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProblemPage />} />
            </Route>

            {/* Coding portal — full-screen, NOT inside dashboard shell */}
            <Route
              path="/problem/:challengeId"
              element={
                <ProtectedRoute>
                  <CodingPortal />
                </ProtectedRoute>
              }
            />

            {/* Weekly SDG task submission — full-screen */}
            <Route
              path="/weekly-task/:taskId"
              element={
                <ProtectedRoute>
                  <WeeklyTaskPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

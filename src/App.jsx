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
import VerifyCertPage from "./pages/VerifyCertPage";

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
              <Route path="wallet-guide" element={<WalletGuidePage />} />
              <Route path="achievements" element={<AchievementsPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

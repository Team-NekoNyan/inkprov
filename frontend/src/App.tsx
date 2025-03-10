import React from "react";
import "./styles/App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/navigation_pages/LandingPage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import Settings from "./components/navigation_pages/Settings";
import OnboardingPage from "./components/navigation_pages/OnboardingPage";
import OpenSessionsPage from "./components/navigation_pages/OpenSessionsPage";
import ProjectsPage from "./components/navigation_pages/ProjectsPage";
import ReadingPage from "./components/navigation_pages/ReadingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <Header
        loggedIn={isAuthenticated}
        page={isAuthenticated ? "dashboard" : "landing"}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/sessions"
          element={
            isAuthenticated ? (
              <OpenSessionsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/projects"
          element={
            isAuthenticated ? (
              <ProjectsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/projects/:projectId/read"
          element={
            isAuthenticated ? <ReadingPage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <Settings />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <>
      <AuthProvider>
        <ToastContainer />
        <AppRoutes />
      </AuthProvider>
    </>
  );
};

export default App;

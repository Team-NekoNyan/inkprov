import React from "react";
import "./styles/App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/navigation_pages/LandingPage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import OnboardingPage from "./components/navigation_pages/OnboardingPage";
import OpenSessionsPage from "./components/navigation_pages/OpenSessionsPage";
import ProjectsPage from "./components/navigation_pages/ProjectsPage";
import ReadingPage from "./components/navigation_pages/ReadingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ToastContainer /> {/* Global toast container */}
      <div className="container mx-auto p-4">
        <Header loggedIn={false} page="landing" />

        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />

          {/* Direct routes to login/register if needed */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes after authentication */}
          <Route path="/placeholder" element={<OnboardingPage />} />
          <Route path="/success" element={<ProjectsPage />} />
          <Route path="/sessions" element={<OpenSessionsPage />} />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;

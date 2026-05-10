import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./features/auth/context/AuthContext";
import ProtectedRoute from "./shared/components/ProtectedRoute";
import Navbar from "./shared/components/Navbar";

// Pages
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import TargetsPage from "./features/targets/pages/TargetsPage";
import AddTargetPage from "./features/targets/pages/AddTargetPage";
import ComposeEmailPage from "./features/email/pages/ComposeEmailPage";
import CampaignsPage from "./features/email/pages/CampaignsPage";
import AwarenessPage from "./features/tracking/pages/AwarenessPage";
import RiskPage from "./features/risk/pages/RiskPage";
import SimulatorPage from "./features/simulator/pages/SimulatorPage";
import TrainingPage from "./features/training/pages/TrainingPage";

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ style: { background: "#1e293b", color: "#f1f5f9" } }} />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/awareness" element={<AwarenessPage />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
          <Route path="/targets" element={<ProtectedRoute><Layout><TargetsPage /></Layout></ProtectedRoute>} />
          <Route path="/targets/add" element={<ProtectedRoute><Layout><AddTargetPage /></Layout></ProtectedRoute>} />
          <Route path="/email/compose/:targetId" element={<ProtectedRoute><Layout><ComposeEmailPage /></Layout></ProtectedRoute>} />
          <Route path="/campaigns" element={<ProtectedRoute><Layout><CampaignsPage /></Layout></ProtectedRoute>} />
          <Route path="/risk" element={<ProtectedRoute><Layout><RiskPage /></Layout></ProtectedRoute>} />
          <Route path="/simulator" element={<ProtectedRoute><Layout><SimulatorPage /></Layout></ProtectedRoute>} />
          <Route path="/training" element={<ProtectedRoute><Layout><TrainingPage /></Layout></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

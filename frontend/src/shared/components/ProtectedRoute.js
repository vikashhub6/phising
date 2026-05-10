import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ color: "#f1f5f9", textAlign: "center", marginTop: "3rem" }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;

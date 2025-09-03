// Centralized logout functionimport React from "react";
import { Navigate } from "react-router-dom";

// Logout helper
export const handleLogout = (navigate) => {
  localStorage.removeItem("webdevhub_user");
  localStorage.setItem("isLoggedIn", "false");
  navigate("/login");
};

// Check login status
export const isUserLoggedIn = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

// Protected Route wrapper
export const ProtectedRoute = ({ children }) => {
  const loggedIn = isUserLoggedIn();
  return loggedIn ? children : <Navigate to="/login" replace />;
};

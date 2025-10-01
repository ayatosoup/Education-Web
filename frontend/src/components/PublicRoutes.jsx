import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

export default function PublicRoute({ children }) {
  // Kalau sudah login, redirect ke /books
  if (isAuthenticated()) {
    return <Navigate to="/books" replace />;
  }
  return children;
}

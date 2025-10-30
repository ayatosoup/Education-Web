import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../../components/LoginCard";
import { login } from "../../services/authService";
import { Box } from "@mui/material";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e, email, password) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/books");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#e0eafc"
      px={{ xs: 2, sm: 3 }}
      py={{ xs: 3, sm: 4 }}
    >
      <LoginCard onLogin={handleLogin} loading={loading} error={error} />
    </Box>
  );
}

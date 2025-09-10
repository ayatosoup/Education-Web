import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../../components/LoginCard";
import authService from "../../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e, email, password) => {
    e.preventDefault();

    // Reset previous error
    setError("");
    setLoading(true);

    try {
      const result = await authService.login(email, password);

      if (result.success) {
        // Login successful, navigate to books page
        navigate("/books");
      } else {
        // Login failed, show error message
        setError(result.message || "Login failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <LoginCard onLogin={handleLogin} loading={loading} error={error} />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#e0eafc",
    padding: "20px",
  },
};

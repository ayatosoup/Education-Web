import React from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../../components/LoginCard";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/books");
  };

  return (
    <div style={styles.container}>
      <LoginCard onLogin={handleLogin} />
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

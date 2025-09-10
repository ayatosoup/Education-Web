import React, { useState } from "react";

export default function LoginCard({ onLogin, loading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(e, email, password);
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Edu-Web</h2>

      {error && <div style={styles.errorMessage}>{error}</div>}

      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          style={{
            ...styles.input,
            ...(loading ? styles.inputDisabled : {}),
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          style={{
            ...styles.input,
            ...(loading ? styles.inputDisabled : {}),
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    width: "100%",
    maxWidth: "360px",
    padding: "40px 30px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "25px",
    color: "#2c3e50",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  input: {
    padding: "12px",
    fontSize: "1rem",
    border: "1px solid #d1d9e6",
    borderRadius: "8px",
    outline: "none",
    transition: "all 0.2s ease",
  },
  inputDisabled: {
    backgroundColor: "#f8f9fa",
    cursor: "not-allowed",
    opacity: "0.7",
  },
  button: {
    padding: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    backgroundColor: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  buttonDisabled: {
    backgroundColor: "#6c757d",
    cursor: "not-allowed",
    opacity: "0.7",
  },
  errorMessage: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    border: "1px solid #f5c6cb",
    fontSize: "0.9rem",
    textAlign: "left",
  },
};

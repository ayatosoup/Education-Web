import React from "react";

export default function LoginCard({ onLogin }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Edu-Web</h2>
      <form style={styles.form} onSubmit={onLogin}>
        <input type="text" placeholder="Username" style={styles.input} />
        <input type="password" placeholder="Password" style={styles.input} />
        <button type="submit" style={styles.button}>
          Login
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
};

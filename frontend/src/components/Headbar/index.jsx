import React from "react";

export default function Headbar() {
  return (
    <header style={styles.headbar}>
      <div style={styles.logo}>Edu-Web</div>

      <nav style={styles.nav}>
        <a href="#" style={styles.link}>
          Home
        </a>
        <a href="#" style={styles.link}>
          About
        </a>
        <a href="#" style={styles.link}>
          Services
        </a>
        <a href="#" style={styles.link}>
          Contact
        </a>
      </nav>
    </header>
  );
}

const styles = {
  headbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    backgroundColor: "#2c3e50",
    color: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  nav: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "1rem",
  },
};

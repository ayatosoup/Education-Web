import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>Edu-Web</div>

      <nav style={styles.nav}>
        <button
          onClick={() => handleNavigation("/books")}
          style={isActive("/books") ? styles.navButtonActive : styles.navButton}
        >
          Home
        </button>

        <button
          onClick={() => handleNavigation("/account")}
          style={
            isActive("/account") ? styles.navButtonActive : styles.navButton
          }
        >
          Account
        </button>
      </nav>

      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    backgroundColor: "#2c3e50",
    color: "white",
    height: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    boxShadow: "2px 0 6px rgba(0,0,0,0.1)",
  },
  logo: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    padding: "0 10px 6px",
    borderBottom: "1px solid #3f536a",
    textAlign: "center",
  },
  nav: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    gap: "8px",
  },
  navButton: {
    padding: "12px 20px",
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "1rem",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "6px",
    margin: "0 10px",
    transition: "background 0.2s ease",
  },
  navButtonActive: {
    padding: "12px 20px",
    backgroundColor: "#34495e",
    border: "none",
    color: "white",
    fontSize: "1rem",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "6px",
    margin: "0 10px",
    transition: "background 0.2s ease",
  },
  logoutButton: {
    padding: "12px 20px",
    margin: "0 10px",
    background: "transparent",
    border: "none",
    color: "#e74c3c",
    fontSize: "1rem",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "background 0.2s ease",
  },
};

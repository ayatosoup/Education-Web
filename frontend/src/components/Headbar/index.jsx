import React from "react";

export default function Headbar() {
  return (
    <header style={styles.headbar}>
      <div style={styles.logo}>Edu-Web</div>

      <div style={styles.profile}>
        <span style={styles.profileName}>John Doe</span>
        <img src="/img/profile.jpg" alt="Profile" style={styles.profileImage} />
      </div>
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
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  profileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  profileName: {
    fontSize: "1rem",
    fontWeight: "500",
    marginRight: "8px",
  },
};

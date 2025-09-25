import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/authService";

export default function Headbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ambil user dari localStorage
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <header style={styles.headbar}>
      <div style={styles.profile}>
        <span style={styles.profileName}>
          {user ? user.name : "User"}
        </span>
        <img src="/img/profile.jpg" alt="Profile" style={styles.profileImage} />
      </div>
    </header>
  );
}

const styles = {
  headbar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "12px 24px",
    backgroundColor: "#2c3e50",
    color: "white",
    position: "fixed",
    top: 0,
    left: "250px",
    right: 0,
    height: "60px",
    zIndex: 999,
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

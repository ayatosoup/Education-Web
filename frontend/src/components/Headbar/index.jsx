import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/authService";

export default function Headbar() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.name) {
      setUserName(user.name);
    }
  }, []);

  return (
    <header style={styles.headbar}>
      <div style={styles.profile}>
        <span style={styles.profileName}>{userName || "Guest"}</span>
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
    left: 0,
    right: 0,
    height: "60px",
    zIndex: 999,
  },
  profile: {
    display: "flex",
    alignItems: "center",
  },
  profileName: {
    fontSize: "1rem",
    fontWeight: "500",
  },
};

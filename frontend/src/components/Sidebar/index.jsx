import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Divider, Stack } from "@mui/material";
import { logout, isAuthenticated, getCurrentUser } from "../../services/authService";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    } else {
      setUser(null);
    }
  }, [location]); // perbarui saat route berubah

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const btnStyle = {
    justifyContent: "flex-start",
    textTransform: "none",
    borderRadius: 1,
    "&:hover": { bgcolor: "#3f536a" },
  };

  return (
    <Box
      sx={{
        width: 250,
        bgcolor: "#2c3e50",
        color: "white",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        p: 2,
        boxShadow: 2,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 2,
          textAlign: "center",
          borderBottom: "1px solid #3f536a",
          pb: 1,
        }}
      >
        Edu-Web
      </Typography>

      {/* Navigation */}
      <Stack spacing={1} flex={1} mt={2}>
        <Button
          variant={isActive("/books") ? "contained" : "text"}
          color="primary"
          onClick={() => handleNavigation("/books")}
          sx={{ ...btnStyle, bgcolor: isActive("/books") ? "#34495e" : "transparent" }}
        >
          Home
        </Button>

        {user?.role === "admin" && (
  <>
    <Button
      variant={isActive("/upload-book") ? "contained" : "text"}
      onClick={() => handleNavigation("/upload-book")}
      sx={{
        justifyContent: "flex-start",
        bgcolor: isActive("/upload-book") ? "#34495e" : "transparent",
        "&:hover": { bgcolor: "#3f536a" },
        borderRadius: 1,
        textTransform: "none",
      }}
    >
      Upload Buku
    </Button>

    <Button
      variant={isActive("/manage-books") ? "contained" : "text"}
      onClick={() => handleNavigation("/manage-books")}
      sx={{
        justifyContent: "flex-start",
        bgcolor: isActive("/manage-books") ? "#34495e" : "transparent",
        "&:hover": { bgcolor: "#3f536a" },
        borderRadius: 1,
        textTransform: "none",
      }}
    >
      Manage Buku
    </Button>
  </>
)}

{user?.role === "admin" && (
  <Button
    variant={isActive("/user-management") ? "contained" : "text"}
    onClick={() => handleNavigation("/user-management")}
    sx={{
      justifyContent: "flex-start",
      bgcolor: isActive("/user-management") ? "#34495e" : "transparent",
      "&:hover": { bgcolor: "#3f536a" },
      borderRadius: 1,
      textTransform: "none",
    }}
  >
    User Management
  </Button>
)}

      </Stack>

      <Divider sx={{ bgcolor: "#3f536a", my: 2 }} />

      {/* User Info or Login/Logout */}
      {user ? (
        <Button
          onClick={handleLogout}
          sx={{
            ...btnStyle,
            color: "#e74c3c",
          }}
        >
          Logout ({user.name})
        </Button>
      ) : (
        <Button
          onClick={() => navigate("/")}
          sx={{
            ...btnStyle,
            color: "#1abc9c",
          }}
        >
          Login
        </Button>
      )}
    </Box>
  );
}

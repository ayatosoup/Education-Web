import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Divider, Stack } from "@mui/material";
import { logout } from "../../services/authService";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

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
          sx={{
            justifyContent: "flex-start",
            bgcolor: isActive("/books") ? "#34495e" : "transparent",
            "&:hover": { bgcolor: "#3f536a" },
            borderRadius: 1,
            textTransform: "none",
          }}
        >
          Home
        </Button>

        <Button
          variant={isActive("/account") ? "contained" : "text"}
          color="primary"
          onClick={() => handleNavigation("/account")}
          sx={{
            justifyContent: "flex-start",
            bgcolor: isActive("/account") ? "#34495e" : "transparent",
            "&:hover": { bgcolor: "#3f536a" },
            borderRadius: 1,
            textTransform: "none",
          }}
        >
          Account
        </Button>
      </Stack>

      <Divider sx={{ bgcolor: "#3f536a", my: 2 }} />

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        sx={{
          justifyContent: "flex-start",
          color: "#e74c3c",
          textTransform: "none",
          "&:hover": { bgcolor: "#3f536a" },
        }}
      >
        Logout
      </Button>
    </Box>
  );
}

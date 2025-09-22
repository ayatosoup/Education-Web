import React from "react";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export default function CloseButton({ onClick }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "fixed",
        top: 2,
        right: 2,
        bgcolor: "rgba(0,0,0,0.8)",
        color: "white",
      }}
    >
      <Close />
    </IconButton>
  );
}

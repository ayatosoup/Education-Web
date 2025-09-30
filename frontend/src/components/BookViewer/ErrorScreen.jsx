import React from "react";
import { Box, Typography, Button } from "@mui/material";

export default function ErrorScreen({ message, onBack }) {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography sx={{ color: "red", fontWeight: 600 }}>
        Failed to load book
      </Typography>
      <Typography
        sx={{ color: "grey.400", textAlign: "center", maxWidth: 400 }}
      >
        {message}
      </Typography>
      <Button variant="contained" color="secondary" onClick={onBack}>
        Go Back
      </Button>
    </Box>
  );
}

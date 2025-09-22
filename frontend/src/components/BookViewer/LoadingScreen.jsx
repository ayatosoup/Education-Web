import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingScreen() {
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
      <CircularProgress color="inherit" />
      <Typography sx={{ color: "white" }}>Loading book...</Typography>
    </Box>
  );
}

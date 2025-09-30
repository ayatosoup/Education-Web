import React from "react";
import { Box, IconButton, Typography, Button } from "@mui/material";
import { NavigateBefore, NavigateNext, Edit, Brush } from "@mui/icons-material";

export default function Controls({
  pageNumber,
  numPages,
  drawingMode,
  eraserMode,
  onPrevPage,
  onNextPage,
  onToggleDrawing,
  onToggleEraser,
  onClearPage,
}) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 2,
        bgcolor: "rgba(0,0,0,0.8)",
        borderRadius: 4,
        p: 2,
        backdropFilter: "blur(10px)",
      }}
    >
      <IconButton
        onClick={onPrevPage}
        disabled={pageNumber <= 1}
        sx={{ color: "white" }}
      >
        <NavigateBefore />
      </IconButton>

      <Typography
        sx={{ color: "white", minWidth: "120px", textAlign: "center" }}
      >
        {pageNumber}-{Math.min(pageNumber + 1, numPages)} of {numPages}
      </Typography>

      <IconButton
        onClick={onNextPage}
        disabled={pageNumber + 1 >= numPages}
        sx={{ color: "white" }}
      >
        <NavigateNext />
      </IconButton>

      <Button
        variant={drawingMode ? "contained" : "outlined"}
        startIcon={<Edit />}
        onClick={onToggleDrawing}
        sx={{
          color: "white",
          borderColor: "white",
          "&:hover": {
            borderColor: "white",
            bgcolor: "rgba(255,255,255,0.1)",
          },
        }}
      >
        {drawingMode ? "Exit Drawing" : "Start Drawing"}
      </Button>

      {drawingMode && (
        <>
          <Button
            variant={eraserMode ? "contained" : "outlined"}
            startIcon={<Brush />}
            onClick={onToggleEraser}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            {eraserMode ? "Eraser On" : "Eraser Off"}
          </Button>

          <Button
            variant="outlined"
            onClick={onClearPage}
            sx={{
              color: "#f59e0b",
              borderColor: "#f59e0b",
              "&:hover": {
                borderColor: "#f59e0b",
                bgcolor: "rgba(245, 158, 11, 0.1)",
              },
            }}
          >
            Clear Page
          </Button>
        </>
      )}
    </Box>
  );
}

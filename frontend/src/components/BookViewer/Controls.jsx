import React from "react";
import { Box, IconButton, Typography, Button } from "@mui/material";
import {
  NavigateBefore,
  NavigateNext,
  Edit,
  Brush,
  Clear,
} from "@mui/icons-material";

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
  isMobile = false,
}) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 10, sm: 20 },
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        gap: { xs: 1, sm: 2 },
        bgcolor: "rgba(0,0,0,0.8)",
        borderRadius: { xs: 2, sm: 4 },
        p: { xs: 1, sm: 2 },
        backdropFilter: "blur(10px)",
        maxWidth: { xs: "95vw", sm: "auto" },
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}
      >
        <IconButton
          onClick={onPrevPage}
          disabled={pageNumber <= 1}
          sx={{ color: "white", p: { xs: 0.5, sm: 1 } }}
        >
          <NavigateBefore />
        </IconButton>

        <Typography
          sx={{
            color: "white",
            minWidth: { xs: "80px", sm: "120px" },
            textAlign: "center",
            fontSize: { xs: "0.75rem", sm: "1rem" },
          }}
        >
          {isMobile
            ? `${pageNumber} / ${numPages}`
            : `${pageNumber}-${Math.min(
                pageNumber + 1,
                numPages
              )} of ${numPages}`}
        </Typography>

        <IconButton
          onClick={onNextPage}
          disabled={
            isMobile ? pageNumber >= numPages : pageNumber + 1 >= numPages
          }
          sx={{ color: "white", p: { xs: 0.5, sm: 1 } }}
        >
          <NavigateNext />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: { xs: 1, sm: 2 },
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button
          variant={drawingMode ? "contained" : "outlined"}
          startIcon={isMobile ? null : <Edit />}
          onClick={onToggleDrawing}
          size={isMobile ? "small" : "medium"}
          sx={{
            color: "white",
            borderColor: "white",
            minWidth: { xs: "auto", sm: "auto" },
            px: { xs: 1, sm: 2 },
            "&:hover": {
              borderColor: "white",
              bgcolor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          {isMobile ? <Edit /> : drawingMode ? "Exit Drawing" : "Start Drawing"}
        </Button>

        {drawingMode && (
          <>
            <Button
              variant={eraserMode ? "contained" : "outlined"}
              startIcon={isMobile ? null : <Brush />}
              onClick={onToggleEraser}
              size={isMobile ? "small" : "medium"}
              sx={{
                color: "white",
                borderColor: "white",
                minWidth: { xs: "auto", sm: "auto" },
                px: { xs: 1, sm: 2 },
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {isMobile ? <Brush /> : eraserMode ? "Eraser On" : "Eraser Off"}
            </Button>

            <Button
              variant="outlined"
              startIcon={isMobile ? null : <Clear />}
              onClick={onClearPage}
              size={isMobile ? "small" : "medium"}
              sx={{
                color: "#f59e0b",
                borderColor: "#f59e0b",
                minWidth: { xs: "auto", sm: "auto" },
                px: { xs: 1, sm: 2 },
                "&:hover": {
                  borderColor: "#f59e0b",
                  bgcolor: "rgba(245, 158, 11, 0.1)",
                },
              }}
            >
              {isMobile ? <Clear /> : "Clear Page"}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}

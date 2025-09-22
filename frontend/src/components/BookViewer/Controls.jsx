import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBack, ArrowForward, Delete, Create } from "@mui/icons-material";

export default function Controls({
  pageNumber,
  numPages,
  drawingMode,
  onPrevPage,
  onNextPage,
  onToggleDrawing,
  onClearAnnotations,
}) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 3,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 1.5,
        bgcolor: "rgba(0,0,0,0.9)",
        borderRadius: 6,
      }}
    >
      <IconButton
        onClick={onPrevPage}
        disabled={pageNumber <= 1}
        sx={{ color: "white" }}
      >
        <ArrowBack />
      </IconButton>
      <IconButton
        onClick={onToggleDrawing}
        sx={{ color: drawingMode ? "red" : "grey" }}
      >
        <Create />
      </IconButton>
      {drawingMode && (
        <IconButton onClick={onClearAnnotations} sx={{ color: "white" }}>
          <Delete />
        </IconButton>
      )}
      <Typography sx={{ color: "white", minWidth: 60, textAlign: "center" }}>
        {pageNumber}
        {pageNumber + 1 <= numPages && ` & ${pageNumber + 1}`} of {numPages}
      </Typography>
      <IconButton
        onClick={onNextPage}
        disabled={pageNumber + 1 > numPages}
        sx={{ color: "white" }}
      >
        <ArrowForward />
      </IconButton>
    </Box>
  );
}

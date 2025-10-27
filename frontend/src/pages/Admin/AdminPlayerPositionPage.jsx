import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Alert } from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";

import {
  getBookById,
  updateDefaultPlayerPosition,
} from "../../services/bookService";
import PageCanvas from "../../components/BookViewer/PageCanvas";
import LoadingScreen from "../../components/BookViewer/LoadingScreen";
import ErrorScreen from "../../components/BookViewer/ErrorScreen";

export default function AdminPlayerPositionPage() {
  const { id, pageNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [playerPositions, setPlayerPositions] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const canvasRefs = useRef({});

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const bookData = await getBookById(id);
        setBook(bookData);

        if (bookData.playerPositions) {
          setPlayerPositions(bookData.playerPositions);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load book.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handlePlayerPositionChange = (pageNum, positions) => {
    setPlayerPositions((prev) => ({
      ...prev,
      [pageNum]: {
        ...prev[pageNum],
        ...positions,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const pageNum = parseInt(pageNumber);
      const positions = playerPositions[pageNum];

      const response = await updateDefaultPlayerPosition(
        id,
        pageNum,
        positions
      );

      navigate(`/admin/books/${id}/pages`, {
        state: { message: "Player positions saved successfully!" },
      });
    } catch (err) {
      setError("Failed to save positions: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/admin/books/${id}/pages`);
  };

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  if (loading) return <LoadingScreen />;
  if (error && !book)
    return <ErrorScreen message={error} onBack={handleCancel} />;

  const pageNum = parseInt(pageNumber);
  const page = book?.pages?.find((p) => p.page_number === pageNum);

  if (!page) {
    return <ErrorScreen message="Page not found" onBack={handleCancel} />;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "black",
      }}
    >
      {/* Header Controls */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "rgba(0,0,0,0.8)",
            p: 2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h6" color="white">
            Set Player Positions - Page {pageNum}
          </Typography>
          <Typography variant="body2" color="yellow">
            Drag players to set default positions
          </Typography>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box
          sx={{
            position: "absolute",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            minWidth: 400,
          }}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Page Canvas */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          p: 2,
        }}
      >
        <PageCanvas
          page={page}
          bookId={book.id}
          pageNum={pageNum}
          annotations={{}}
          setAnnotations={() => {}}
          drawingMode={false}
          eraserMode={false}
          canvasRefs={canvasRefs}
          playerPositions={playerPositions}
          isAdminMode={true}
          onPlayerPositionChange={(positions) =>
            handlePlayerPositionChange(pageNum, positions)
          }
        />
      </Box>

      {/* Bottom Controls */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 2,
          bgcolor: "rgba(0,0,0,0.8)",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Cancel />}
          onClick={handleCancel}
          disabled={saving}
          sx={{ color: "white", borderColor: "white" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saving || !hasChanges}
        >
          {saving ? "Saving..." : "Save Positions"}
        </Button>
      </Box>
    </Box>
  );
}

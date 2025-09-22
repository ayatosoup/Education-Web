import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { getBookById } from "../../services/bookService";

import PageCanvas from "./PageCanvas";
import Controls from "./Controls";
import CloseButton from "./CloseButton";
import LoadingScreen from "./LoadingScreen";
import ErrorScreen from "./ErrorScreen";

export default function BookViewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [drawingMode, setDrawingMode] = useState(false);
  const [annotations, setAnnotations] = useState({});

  const canvasRefs = useRef({});

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await getBookById(id);
        setBook(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load book.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const goNext = () =>
    book &&
    pageNumber + 2 <= book.pages.length &&
    setPageNumber(pageNumber + 2);
  const goPrev = () => pageNumber - 2 >= 1 && setPageNumber(pageNumber - 2);
  const goBack = () => navigate(-1);

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onBack={goBack} />;

  const toggleDrawingMode = () => setDrawingMode((prev) => !prev);
  const clearAllAnnotations = () => setAnnotations({});

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onBack={goBack} />;

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
      <CloseButton onClick={goBack} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          p: 2,
          height: "100%",
          alignItems: "center",
        }}
      >
        {[pageNumber, pageNumber + 1].map((num) =>
          book.pages[num - 1] ? (
            <PageCanvas
              key={num}
              page={book.pages[num - 1]}
              bookId={book.id}
              pageNum={num}
              annotations={annotations}
              setAnnotations={setAnnotations}
              drawingMode={drawingMode}
              canvasRefs={canvasRefs}
            />
          ) : null
        )}
      </Box>

      <Controls
        pageNumber={pageNumber}
        numPages={book.pages.length}
        drawingMode={drawingMode}
        onPrevPage={goPrev}
        onNextPage={goNext}
        onToggleDrawing={toggleDrawingMode}
        onClearAnnotations={clearAllAnnotations}
      />
    </Box>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { getBookById, fetchBookTOC } from "../../services/bookService";
import {
  clearPageAnnotations,
  getBookAnnotations,
} from "../../services/annotationService";

import PageCanvas from "./PageCanvas";
import Controls from "./Controls";
import CloseButton from "./CloseButton";
import LoadingScreen from "./LoadingScreen";
import ErrorScreen from "./ErrorScreen";

export default function BookViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [book, setBook] = useState(null);
  const [toc, setToc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [drawingMode, setDrawingMode] = useState(false);
  const [eraserMode, setEraserMode] = useState(false);
  const [annotations, setAnnotations] = useState({});
  const [tocOpen, setTocOpen] = useState(false);
  const [playerPositions, setPlayerPositions] = useState({});

  const canvasRefs = useRef({});

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);

        const bookData = await getBookById(id);
        const tocData = await fetchBookTOC(id);

        setBook(bookData);
        setToc(tocData);

        if (bookData.playerPositions) {
          setPlayerPositions(bookData.playerPositions);
        }

        const annotationsData = await getBookAnnotations(id);

        const formatted = {};
        Object.keys(annotationsData).forEach((pageNum) => {
          formatted[pageNum] = annotationsData[pageNum].paths || [];
        });

        setAnnotations(formatted);
      } catch (err) {
        console.error(err);
        setError("Failed to load book.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const goNext = () => {
    if (!book) return;
    const increment = isMobile ? 1 : 2;
    if (pageNumber + increment <= book.pages.length) {
      setPageNumber(pageNumber + increment);
    }
  };

  const goPrev = () => {
    const decrement = isMobile ? 1 : 2;
    if (pageNumber - decrement >= 1) {
      setPageNumber(pageNumber - decrement);
    }
  };

  const goBack = () => navigate(-1);

  const jumpToPage = (num) => {
    setPageNumber(isMobile ? num : num % 2 === 0 ? num - 1 : num);
    setTocOpen(false);
  };

  const toggleDrawingMode = () => setDrawingMode((prev) => !prev);
  const toggleEraserMode = () => setEraserMode((prev) => !prev);

  const clearCurrentPage = async () => {
    const pagesToClear = isMobile ? [pageNumber] : [pageNumber, pageNumber + 1];
    const validPages = pagesToClear.filter((p) => book.pages[p - 1]);

    const pageSpread =
      validPages.length === 2
        ? `pages ${validPages[0]} and ${validPages[1]}`
        : `page ${validPages[0]}`;

    if (
      window.confirm(
        `Are you sure you want to clear all drawings on ${pageSpread}?`
      )
    ) {
      try {
        await Promise.all(validPages.map((p) => clearPageAnnotations(id, p)));

        setAnnotations((prev) => {
          const newAnnotations = { ...prev };
          validPages.forEach((p) => delete newAnnotations[p]);
          return newAnnotations;
        });
      } catch (error) {
        console.error("Failed to clear annotations:", error);
      }
    }
  };

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onBack={goBack} />;

  const pagesToDisplay = isMobile ? [pageNumber] : [pageNumber, pageNumber + 1];

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "black",
        overflow: "hidden",
      }}
    >
      <CloseButton onClick={goBack} />

      <IconButton
        onClick={() => setTocOpen(true)}
        sx={{
          position: "absolute",
          top: { xs: 8, sm: 16 },
          left: { xs: 8, sm: 16 },
          color: "white",
          zIndex: 10,
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer anchor="left" open={tocOpen} onClose={() => setTocOpen(false)}>
        <List sx={{ width: { xs: 250, sm: 300 } }}>
          <ListItem>
            <ListItemText primary="Table of Contents" />
          </ListItem>
          {toc.map((entry) => (
            <ListItem
              button
              key={entry.id}
              onClick={() => jumpToPage(entry.page_number)}
            >
              <ListItemText
                primary={entry.title}
                secondary={`Page ${entry.page_number}`}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 1, md: 2 },
          p: { xs: 1, sm: 2 },
          height: "100%",
          overflowY: { xs: "auto", md: "hidden" },
        }}
      >
        {pagesToDisplay.map((num) =>
          book.pages[num - 1] ? (
            <PageCanvas
              key={num}
              page={book.pages[num - 1]}
              bookId={book.id}
              pageNum={num}
              annotations={annotations}
              setAnnotations={setAnnotations}
              drawingMode={drawingMode}
              eraserMode={eraserMode}
              canvasRefs={canvasRefs}
              playerPositions={playerPositions}
              isMobile={isMobile}
            />
          ) : null
        )}
      </Box>

      <Controls
        pageNumber={pageNumber}
        numPages={book.pages.length}
        drawingMode={drawingMode}
        eraserMode={eraserMode}
        onPrevPage={goPrev}
        onNextPage={goNext}
        onToggleDrawing={toggleDrawingMode}
        onToggleEraser={toggleEraserMode}
        onClearPage={clearCurrentPage}
        isMobile={isMobile}
      />
    </Box>
  );
}

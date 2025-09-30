import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
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

  const [book, setBook] = useState(null);
  const [toc, setToc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [drawingMode, setDrawingMode] = useState(false);
  const [eraserMode, setEraserMode] = useState(false);
  const [annotations, setAnnotations] = useState({});
  const [tocOpen, setTocOpen] = useState(false);

  const canvasRefs = useRef({});

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);

        // fetch book and TOC
        const bookData = await getBookById(id);
        const tocData = await fetchBookTOC(id);

        setBook(bookData);
        setToc(tocData);

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

  const goNext = () =>
    book &&
    pageNumber + 2 <= book.pages.length &&
    setPageNumber(pageNumber + 2);

  const goPrev = () => pageNumber - 2 >= 1 && setPageNumber(pageNumber - 2);

  const goBack = () => navigate(-1);

  const jumpToPage = (num) => {
    setPageNumber(num % 2 === 0 ? num - 1 : num);
    setTocOpen(false);
  };

  const toggleDrawingMode = () => setDrawingMode((prev) => !prev);
  const toggleEraserMode = () => setEraserMode((prev) => !prev);

  const clearCurrentPage = async () => {
    const rightPageNum = pageNumber + 1;
    const pageSpread = book.pages[rightPageNum - 1]
      ? `pages ${pageNumber} and ${rightPageNum}`
      : `page ${pageNumber}`;

    if (
      window.confirm(
        `Are you sure you want to clear all drawings on ${pageSpread}?`
      )
    ) {
      try {
        const clearLeftPagePromise = clearPageAnnotations(id, pageNumber);
        const clearRightPagePromise = book.pages[pageNumber]
          ? clearPageAnnotations(id, pageNumber + 1)
          : Promise.resolve();

        await Promise.all([clearLeftPagePromise, clearRightPagePromise]);

        setAnnotations((prev) => {
          const newAnnotations = { ...prev };
          delete newAnnotations[pageNumber];
          delete newAnnotations[pageNumber + 1];
          return newAnnotations;
        });
      } catch (error) {
        console.error("Failed to clear current spread annotations:", error);
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

      <IconButton
        onClick={() => setTocOpen(true)}
        sx={{ position: "absolute", top: 16, left: 16, color: "white" }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer anchor="left" open={tocOpen} onClose={() => setTocOpen(false)}>
        <List sx={{ width: 250 }}>
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
              eraserMode={eraserMode}
              canvasRefs={canvasRefs}
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
      />
    </Box>
  );
}

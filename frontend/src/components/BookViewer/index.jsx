import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

// PDF Constants
const PDF_SCALE = 1.8;
const CONTROL_HIDE_DELAY = 3000;
const PDF_JS_VERSION = "3.11.174";

export default function BookViewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  // PDF State
  const [pdfDocument, setPdfDocument] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageImages, setPageImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [showControls, setShowControls] = useState(true);

  // Drawing State
  const [annotations, setAnnotations] = useState({});
  const [drawingMode, setDrawingMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [currentDrawingPage, setCurrentDrawingPage] = useState(null);

  // PDF Initialization
  useEffect(() => {
    const loadPdfLibrary = async () => {
      if (window.pdfjsLib) return;

      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.min.js`;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initializePdf = async () => {
      try {
        setLoading(true);
        setError(null);

        await loadPdfLibrary();

        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.worker.min.js`;

        const filePath = `/books/book${id}.pdf`;
        const loadingTask = window.pdfjsLib.getDocument(filePath);
        const pdf = await loadingTask.promise;

        setPdfDocument(pdf);
        setNumPages(pdf.numPages);
      } catch (err) {
        console.error("PDF loading error:", err);
        setError(`Failed to load PDF: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializePdf();

    return () => {
      if (pdfDocument) {
        pdfDocument.destroy();
      }
    };
  }, [id]);

  // Page Rendering
  const renderPage = useCallback(
    async (pageNum) => {
      if (!pdfDocument || pageImages[pageNum]) return;

      try {
        const page = await pdfDocument.getPage(pageNum);
        const viewport = page.getViewport({ scale: PDF_SCALE });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        setPageImages((prev) => ({
          ...prev,
          [pageNum]: canvas.toDataURL(),
        }));
      } catch (err) {
        console.error(`Error rendering page ${pageNum}:`, err);
      }
    },
    [pdfDocument, pageImages]
  );

  // Pre-render current and next page
  useEffect(() => {
    if (!pdfDocument) return;

    renderPage(pageNumber);
    if (pageNumber + 1 <= numPages) {
      renderPage(pageNumber + 1);
    }
  }, [pdfDocument, pageNumber, numPages, renderPage]);

  // Navigation Functions
  const goToNextPage = () => {
    if (pageNumber + 2 <= numPages) {
      setPageNumber(pageNumber + 2);
    }
  };

  const goToPrevPage = () => {
    if (pageNumber - 2 >= 1) {
      setPageNumber(pageNumber - 2);
    }
  };

  const goBack = () => navigate(-1);

  // Drawing Functions
  const getRelativePosition = (event, element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handleDrawStart = (event, pageNum) => {
    if (!drawingMode) return;

    setIsDrawing(true);
    setCurrentDrawingPage(pageNum);
    const position = getRelativePosition(event, event.currentTarget);
    setCurrentPath([position]);
  };

  const handleDrawMove = (event, pageNum) => {
    if (!isDrawing || currentDrawingPage !== pageNum) return;

    const position = getRelativePosition(event, event.currentTarget);
    setCurrentPath((prev) => [...prev, position]);
  };

  const handleDrawEnd = (pageNum) => {
    if (!isDrawing || currentPath.length === 0) return;

    setAnnotations((prev) => ({
      ...prev,
      [pageNum]: [...(prev[pageNum] || []), currentPath],
    }));

    setIsDrawing(false);
    setCurrentPath([]);
    setCurrentDrawingPage(null);
  };

  const toggleDrawingMode = () => setDrawingMode((prev) => !prev);
  const clearAllAnnotations = () => setAnnotations({});

  useEffect(() => {
    let hideTimeout;

    const resetControlsTimeout = () => {
      clearTimeout(hideTimeout);
      setShowControls(true);
      hideTimeout = setTimeout(
        () => setShowControls(false),
        CONTROL_HIDE_DELAY
      );
    };

    const handleMouseMove = () => resetControlsTimeout();

    const handleKeyDown = (event) => {
      resetControlsTimeout();

      switch (event.key) {
        case "Escape":
          goBack();
          break;
        case "ArrowLeft":
          goToPrevPage();
          break;
        case "ArrowRight":
          goToNextPage();
          break;
        case "d":
        case "D":
          toggleDrawingMode();
          break;
        default:
          break;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyDown);
    resetControlsTimeout();

    return () => {
      clearTimeout(hideTimeout);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [pageNumber, numPages]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onBack={goBack} />;

  return (
    <div style={styles.viewer}>
      <CloseButton onClick={goBack} />

      <div style={styles.pageWrapper}>
        <PageView
          pageNum={pageNumber}
          pageImage={pageImages[pageNumber]}
          annotations={annotations[pageNumber]}
          drawingMode={drawingMode}
          isDrawing={isDrawing && currentDrawingPage === pageNumber}
          currentPath={currentPath}
          onDrawStart={(e) => handleDrawStart(e, pageNumber)}
          onDrawMove={(e) => handleDrawMove(e, pageNumber)}
          onDrawEnd={() => handleDrawEnd(pageNumber)}
        />

        {pageNumber + 1 <= numPages && (
          <PageView
            pageNum={pageNumber + 1}
            pageImage={pageImages[pageNumber + 1]}
            annotations={annotations[pageNumber + 1]}
            drawingMode={drawingMode}
            isDrawing={isDrawing && currentDrawingPage === pageNumber + 1}
            currentPath={currentPath}
            onDrawStart={(e) => handleDrawStart(e, pageNumber + 1)}
            onDrawMove={(e) => handleDrawMove(e, pageNumber + 1)}
            onDrawEnd={() => handleDrawEnd(pageNumber + 1)}
          />
        )}
      </div>

      <Controls
        show={showControls}
        pageNumber={pageNumber}
        numPages={numPages}
        drawingMode={drawingMode}
        onPrevPage={goToPrevPage}
        onNextPage={goToNextPage}
        onToggleDrawing={toggleDrawingMode}
        onClearAnnotations={clearAllAnnotations}
      />
    </div>
  );
}

// PageView
const PageView = ({
  pageNum,
  pageImage,
  annotations = [],
  drawingMode,
  isDrawing,
  currentPath,
  onDrawStart,
  onDrawMove,
  onDrawEnd,
}) => (
  <div style={styles.pageContainer}>
    {pageImage ? (
      <>
        <img
          src={pageImage}
          alt={`Page ${pageNum}`}
          style={styles.pageImage(drawingMode)}
          draggable={false}
        />
        <svg
          style={styles.svgOverlay(drawingMode)}
          onMouseDown={onDrawStart}
          onMouseMove={onDrawMove}
          onMouseUp={onDrawEnd}
          onMouseLeave={onDrawEnd}
        >
          {annotations.map((path, index) => (
            <polyline
              key={index}
              points={path.map((point) => `${point.x},${point.y}`).join(" ")}
              style={styles.annotationLine}
            />
          ))}
          {isDrawing && currentPath.length > 1 && (
            <polyline
              points={currentPath
                .map((point) => `${point.x},${point.y}`)
                .join(" ")}
              style={styles.annotationLine}
            />
          )}
        </svg>
      </>
    ) : (
      <div style={styles.pagePlaceholder}>
        <div style={styles.spinner} />
        <span>Loading page {pageNum}...</span>
      </div>
    )}
  </div>
);

const Controls = ({
  show,
  pageNumber,
  numPages,
  drawingMode,
  onPrevPage,
  onNextPage,
  onToggleDrawing,
  onClearAnnotations,
}) => (
  <div style={{ ...styles.controls, opacity: show ? 1 : 0 }}>
    <button
      onClick={onPrevPage}
      disabled={pageNumber <= 1}
      style={styles.controlButton}
      title="Previous pages (←)"
    >
      ◀
    </button>

    <button
      onClick={onToggleDrawing}
      style={{
        ...styles.controlButton,
        backgroundColor: drawingMode ? "#ef4444" : "#6b7280",
      }}
      title="Toggle drawing mode (D)"
    >
      ✏️
    </button>

    {drawingMode && (
      <button
        onClick={onClearAnnotations}
        style={styles.controlButton}
        title="Clear all annotations"
      >
        🗑️
      </button>
    )}

    <div style={styles.pageInfo}>
      {pageNumber}
      {pageNumber + 1 <= numPages && ` & ${pageNumber + 1}`} of {numPages}
    </div>

    <button
      onClick={onNextPage}
      disabled={pageNumber + 1 > numPages}
      style={styles.controlButton}
      title="Next pages (→)"
    >
      ▶
    </button>
  </div>
);

const CloseButton = ({ onClick }) => (
  <button
    style={styles.closeButton}
    onClick={onClick}
    title="Close viewer (Esc)"
  >
    ✕
  </button>
);

const LoadingScreen = () => (
  <div style={styles.fullScreenCenter}>
    <div style={styles.spinner} />
    <div style={styles.loadingText}>Loading PDF...</div>
  </div>
);

const ErrorScreen = ({ message, onBack }) => (
  <div style={styles.fullScreenCenter}>
    <div style={styles.errorTitle}>Failed to load PDF</div>
    <div style={styles.errorMessage}>{message}</div>
    <button onClick={onBack} style={styles.backButton}>
      Go Back
    </button>
  </div>
);

// Styles
const styles = {
  viewer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "#000000",
    overflow: "hidden",
    userSelect: "none",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  pageWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    gap: "20px",
    padding: "20px",
    justifyContent: "center",
    alignItems: "center",
  },

  pageContainer: {
    position: "relative",
    maxHeight: "90vh",
    maxWidth: "45vw",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(255, 255, 255, 0.1)",
  },

  pageImage: (drawingMode) => ({
    maxWidth: "100%",
    maxHeight: "90vh",
    display: "block",
    pointerEvents: drawingMode ? "none" : "auto",
  }),

  svgOverlay: (drawingMode) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    cursor: drawingMode ? "crosshair" : "default",
    pointerEvents: drawingMode ? "auto" : "none",
  }),

  annotationLine: {
    stroke: "#ef4444",
    strokeWidth: 3,
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },

  pagePlaceholder: {
    width: "400px",
    height: "600px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    backgroundColor: "#f8fafc",
    color: "#64748b",
    fontSize: "14px",
  },

  closeButton: {
    position: "fixed",
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    zIndex: 1000,
    transition: "background-color 0.2s ease",
  },

  controls: {
    position: "fixed",
    bottom: 30,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "12px 24px",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: 60,
    backdropFilter: "blur(12px)",
    transition: "opacity 0.3s ease",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  },

  controlButton: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    backgroundColor: "#6b7280",
    color: "#ffffff",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  pageInfo: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    minWidth: "80px",
    textAlign: "center",
  },

  fullScreenCenter: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "#000000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
  },

  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #374151",
    borderTop: "3px solid #ffffff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    color: "#ffffff",
    opacity: 0.8,
    fontSize: "16px",
  },

  errorTitle: {
    color: "#ef4444",
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
  },

  errorMessage: {
    color: "#9ca3af",
    fontSize: "14px",
    marginBottom: "24px",
    textAlign: "center",
    maxWidth: "400px",
  },

  backButton: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#374151",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
  },
};

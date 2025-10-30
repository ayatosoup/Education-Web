import { useRef } from "react";
import { saveAnnotations } from "../../services/annotationService";

export default function useDrawing({
  pageNum,
  bookId,
  drawingMode,
  eraserMode,
  canvasRefs,
  annotations,
  setAnnotations,
}) {
  const isDrawingRef = useRef(false);
  const currentPathRef = useRef([]);
  const pathsToKeep = useRef([]);

  const getCanvasAndContext = () => {
    const canvas = canvasRefs.current[pageNum];
    const ctx = canvas?.getContext("2d");
    return { canvas, ctx };
  };

  const getCoords = (event) => {
    const canvas = canvasRefs.current[pageNum];
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if (event.type.startsWith("touch")) {
      clientX = event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX;
      clientY = event.touches[0]?.clientY ?? event.changedTouches[0]?.clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const redrawCanvas = (paths) => {
    const { canvas, ctx } = getCanvasAndContext();
    if (!canvas || !ctx) return;
    const img = new Image();
    img.src = canvas.toDataURL();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      paths.forEach((path) => {
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        path.forEach((point, i) =>
          i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)
        );
        ctx.stroke();
      });
    };
  };

  const handleDrawStart = (event) => {
    if (!drawingMode) return;
    isDrawingRef.current = true;

    if (eraserMode) {
      pathsToKeep.current = annotations[pageNum] || [];
      handleDrawMove(event);
    } else {
      const coords = getCoords(event);
      if (!coords) return;
      currentPathRef.current = [coords];
      const { ctx } = getCanvasAndContext();
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    }
  };

  const handleDrawMove = (event) => {
    if (!isDrawingRef.current || !drawingMode) return;
    const coords = getCoords(event);
    if (!coords) return;

    if (eraserMode) {
      const eraserRadius = 15;
      let pathsChanged = false;

      const remainingPaths = pathsToKeep.current.filter((path) => {
        const isHit = path.some((point) => {
          const distance = Math.sqrt(
            Math.pow(point.x - coords.x, 2) + Math.pow(point.y - coords.y, 2)
          );
          return distance < eraserRadius;
        });
        return !isHit;
      });

      if (remainingPaths.length < pathsToKeep.current.length) {
        pathsChanged = true;
        pathsToKeep.current = remainingPaths;
        redrawCanvas(remainingPaths);
      }
    } else {
      currentPathRef.current.push(coords);
      const { ctx } = getCanvasAndContext();
      if (!ctx) return;
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const handleDrawEnd = async () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    let finalPaths;
    const originalPaths = annotations[pageNum] || [];

    if (eraserMode) {
      finalPaths = pathsToKeep.current;
      if (finalPaths.length === originalPaths.length) return;
    } else {
      if (currentPathRef.current.length < 2) {
        currentPathRef.current = [];
        return;
      }
      const newPath = [...currentPathRef.current];
      currentPathRef.current = [];
      finalPaths = [...originalPaths, newPath];
    }

    setAnnotations((prev) => ({
      ...prev,
      [pageNum]: finalPaths,
    }));

    try {
      await saveAnnotations(bookId, pageNum, finalPaths);
    } catch (error) {
      console.error("Failed to save annotation:", error);
      alert("Error: Could not save your changes. Please try again.");

      setAnnotations((prev) => ({
        ...prev,
        [pageNum]: originalPaths,
      }));
    }
  };

  return { handleDrawStart, handleDrawMove, handleDrawEnd };
}

import { useState, useCallback } from "react";

export default function useDrawing({
  pageNum,
  drawingMode,
  canvasRefs,
  annotations,
  setAnnotations,
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [currentDrawingPage, setCurrentDrawingPage] = useState(null);

  const getPos = useCallback((e, el) => {
    if (!el) return { x: 0, y: 0 }; // fallback
    const rect = el.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const drawAnnotations = useCallback((ctx, paths) => {
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
  }, []);

  const handleDrawStart = useCallback(
    (e) => {
      if (!drawingMode) return;
      const canvas = canvasRefs.current[pageNum];
      if (!canvas) return;

      setIsDrawing(true);
      setCurrentDrawingPage(pageNum);
      setCurrentPath([getPos(e, canvas)]);
    },
    [drawingMode, pageNum, getPos, canvasRefs]
  );

  const handleDrawMove = useCallback(
    (e) => {
      if (!isDrawing || currentDrawingPage !== pageNum) return;
      const canvas = canvasRefs.current[pageNum];
      if (!canvas) return;

      setCurrentPath((prev) => [...prev, getPos(e, canvas)]);
    },
    [isDrawing, currentDrawingPage, pageNum, getPos, canvasRefs]
  );

  const handleDrawEnd = useCallback(() => {
    if (!isDrawing || currentPath.length === 0) return;

    // Save annotation
    setAnnotations((prev) => ({
      ...prev,
      [pageNum]: [...(prev[pageNum] || []), currentPath],
    }));

    // Draw on canvas
    const canvas = canvasRefs.current[pageNum];
    const ctx = canvas?.getContext("2d");
    if (ctx) drawAnnotations(ctx, [currentPath]);

    setIsDrawing(false);
    setCurrentPath([]);
    setCurrentDrawingPage(null);
  }, [
    isDrawing,
    currentPath,
    pageNum,
    canvasRefs,
    drawAnnotations,
    setAnnotations,
  ]);

  return { handleDrawStart, handleDrawMove, handleDrawEnd };
}

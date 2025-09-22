import React, { useEffect } from "react";
import useDrawing from "./useDrawing";

export default function PageCanvas({
  page,
  bookId,
  pageNum,
  annotations,
  setAnnotations,
  drawingMode,
  canvasRefs,
}) {
  const { handleDrawStart, handleDrawMove, handleDrawEnd } = useDrawing({
    pageNum,
    drawingMode,
    canvasRefs,
    annotations,
    setAnnotations,
  });

  // Draw the page + existing annotations
  useEffect(() => {
    const canvas = canvasRefs.current[pageNum];
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = new Image();
    img.src = `${
      import.meta.env.VITE_API_BASE_URL
    }/books/pages/${bookId}/${page.page_path.split("/").pop()}`;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      if (annotations[pageNum]) {
        annotations[pageNum].forEach((path) => {
          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 3;
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.beginPath();
          path.forEach((point, i) =>
            i === 0
              ? ctx.moveTo(point.x, point.y)
              : ctx.lineTo(point.x, point.y)
          );
          ctx.stroke();
        });
      }
    };
  }, [page, bookId, pageNum, annotations, canvasRefs]);

  return (
    <canvas
      ref={(el) => (canvasRefs.current[pageNum] = el)}
      onMouseDown={handleDrawStart}
      onMouseMove={handleDrawMove}
      onMouseUp={handleDrawEnd}
      onMouseLeave={handleDrawEnd}
      style={{
        borderRadius: 8,
        boxShadow: "0 10px 40px rgba(255,255,255,0.1)",
        maxHeight: "90vh",
        maxWidth: "45vw",
        backgroundColor: "#fff",
      }}
    />
  );
}

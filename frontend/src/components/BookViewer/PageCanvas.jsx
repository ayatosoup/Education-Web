// PageCanvas.js (Removed the duplicate DraggableAudioPlayer)
import React, { useEffect, useState } from "react";
import useDrawing from "./useDrawing"; // Custom drawing hook
import DraggableAudioPlayer from "./DraggableAudioPlayer";
import DraggableVideoPlayer from "./DraggableVideoPlayer";
import { fetchAudio } from "../../services/bookService";

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

  const [audioUrl, setAudioUrl] = useState("");

  // Fetch audio blob and create object URL
  useEffect(() => {
    if (!page.audio_path) return;

    let objectUrl = null;

    fetchAudio(bookId, page.audio_path)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setAudioUrl(objectUrl);
      })
      .catch(() => setAudioUrl(""));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [bookId, page.audio_path]);

  // Draw page image and annotations
  useEffect(() => {
    const canvas = canvasRefs.current[pageNum];
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `${
      import.meta.env.VITE_API_BASE_URL
    }/books/pages/${bookId}/${page.page_path.split("/").pop()}`;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      annotations[pageNum]?.forEach((path) => {
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

    img.onerror = () => {
      console.error("Failed to load page image:", img.src);
    };
  }, [page, bookId, pageNum, annotations, canvasRefs]);

  return (
    <div style={{ position: "relative", lineHeight: 0 }}>
      <canvas
        ref={(el) => (canvasRefs.current[pageNum] = el)}
        onMouseDown={handleDrawStart}
        onMouseMove={handleDrawMove}
        onMouseUp={handleDrawEnd}
        onMouseLeave={handleDrawEnd}
        style={{
          borderRadius: 8,
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          maxHeight: "90vh",
          maxWidth: "45vw",
          backgroundColor: "#fff",
          display: "block",
        }}
      />

      {audioUrl && <DraggableAudioPlayer key={audioUrl} audioSrc={audioUrl} />}

      {page.video_link && (
        <DraggableVideoPlayer
          key={page.video_link}
          videoUrl={page.video_link}
        />
      )}
    </div>
  );
}

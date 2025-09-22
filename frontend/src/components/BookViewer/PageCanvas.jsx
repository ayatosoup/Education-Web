import React, { useEffect, useState } from "react";
import useDrawing from "./useDrawing";
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
  eraserMode,
  canvasRefs,
}) {
  const { handleDrawStart, handleDrawMove, handleDrawEnd } = useDrawing({
    pageNum,
    bookId,
    drawingMode,
    eraserMode,
    canvasRefs,
    annotations,
    setAnnotations,
  });

  const [audioUrl, setAudioUrl] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);

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

  useEffect(() => {
    setIsImageLoading(true);

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

      const currentAnnotations = annotations[pageNum] || [];
      currentAnnotations.forEach((path) => {
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

      setIsImageLoading(false);
    };

    img.onerror = () => {
      console.error("Failed to load page image:", img.src);
      setIsImageLoading(false);
    };
  }, [page, bookId, pageNum, annotations, canvasRefs]);

  const getCursorStyle = () => {
    if (!drawingMode) {
      return "default";
    }
    if (eraserMode) {
      return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" fill="rgba(255, 255, 255, 0.5)" /></svg>') 12 12, auto`;
    }
    return "crosshair";
  };

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
          backgroundColor: "transparent",
          display: "block",
          cursor: getCursorStyle(),
          opacity: isImageLoading ? 0 : 1,
          transition: "opacity 0.4s ease-in-out",
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

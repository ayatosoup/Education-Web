import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { PlayCircleOutline, Close } from "@mui/icons-material";

export default function DraggableVideoPlayer({ videoUrl }) {
  const playerRef = useRef(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const getEmbedUrl = (url) => {
    let videoId = "";
    try {
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      } else if (url.includes("youtube.com/watch")) {
        const params = new URLSearchParams(url.split("?")[1]);
        videoId = params.get("v");
      }
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } catch {
      return url;
    }
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setDragging(true);
    const rect = playerRef.current?.getBoundingClientRect();
    if (!rect) return;
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      const parentRect =
        playerRef.current?.parentElement?.getBoundingClientRect();
      if (!parentRect) return;
      setPosition({
        x: e.clientX - parentRect.left - offset.current.x,
        y: e.clientY - parentRect.top - offset.current.y,
      });
    };

    const handleMouseUp = () => setDragging(false);

    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  // Reset when video changes
  useEffect(() => {
    setIsExpanded(false);
    setPlaying(false);
    setPosition({ x: 50, y: 50 });
  }, [videoUrl]);

  if (!isExpanded) {
    return (
      <Box
        ref={playerRef}
        onMouseDown={handleMouseDown}
        sx={{
          position: "absolute",
          top: position.y,
          left: position.x,
          zIndex: 999,
          cursor: dragging ? "grabbing" : "grab",
        }}
      >
        <IconButton
          onClick={() => setIsExpanded(true)}
          sx={{
            color: "white",
            backgroundColor: "rgba(0,0,0,0.6)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
          }}
        >
          <PlayCircleOutline sx={{ fontSize: 48 }} />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      ref={playerRef}
      onMouseDown={handleMouseDown}
      sx={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: 320,
        height: 180,
        zIndex: 999,
        cursor: dragging ? "grabbing" : "grab",
        bgcolor: "black",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      }}
    >
      {!playing ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: 50,
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setPlaying(true);
          }}
        >
          <PlayCircleOutline fontSize="inherit" />
        </Box>
      ) : (
        <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
          <iframe
            src={getEmbedUrl(videoUrl)}
            title="YouTube Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: "100%", height: "100%" }}
          />
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setPlaying(false);
              setIsExpanded(false);
            }}
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <Close />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { PlayCircleOutline, Close } from "@mui/icons-material";
import { updateUserPlayerPosition } from "../../services/bookService";
import { getCurrentUser } from "../../services/authService";

export default function DraggableVideoPlayer({
  videoUrl,
  bookId,
  pageNumber,
  initialPosition,
  isAdminMode = false,
  onPositionChange,
  isMobile = false,
}) {
  const playerRef = useRef(null);
  const containerCheckRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(initialPosition || { x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const saveTimeoutRef = useRef(null);

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

  const constrainPosition = (pos, expanded = isExpanded) => {
    if (!playerRef.current?.parentElement) return pos;

    const parentRect = playerRef.current.parentElement.getBoundingClientRect();
    const playerWidth = isMobile ? (expanded ? 280 : 48) : expanded ? 320 : 48;
    const playerHeight = isMobile ? (expanded ? 158 : 48) : expanded ? 180 : 48;

    return {
      x: Math.max(0, Math.min(pos.x, parentRect.width - playerWidth)),
      y: Math.max(0, Math.min(pos.y, parentRect.height - playerHeight)),
    };
  };

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  useEffect(() => {
    const handleResize = () => {
      if (containerCheckRef.current) {
        clearTimeout(containerCheckRef.current);
      }

      containerCheckRef.current = setTimeout(() => {
        setPosition((prev) => constrainPosition(prev));
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerCheckRef.current) {
        clearTimeout(containerCheckRef.current);
      }
    };
  }, [isMobile, isExpanded]);

  useEffect(() => {
    if (!dragging && position) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          if (isAdminMode) {
            if (onPositionChange) {
              onPositionChange({ video_position: position });
            }
          } else {
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.role !== "admin") {
              await updateUserPlayerPosition(bookId, pageNumber, {
                video_position: position,
              });
            }
          }
        } catch (err) {
          console.error("Failed to save video position:", err);
        }
      }, 500);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [dragging, position, bookId, pageNumber, isAdminMode, onPositionChange]);

  const handleInteractionStart = (e) => {
    e.stopPropagation();

    const clientX = e.type.startsWith("touch")
      ? e.touches[0].clientX
      : e.clientX;
    const clientY = e.type.startsWith("touch")
      ? e.touches[0].clientY
      : e.clientY;

    setDragging(true);
    setHasDragged(false);
    const rect = playerRef.current?.getBoundingClientRect();
    if (!rect) return;
    offset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  useEffect(() => {
    const handleInteractionMove = (e) => {
      if (!dragging) return;
      setHasDragged(true);

      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      const parentRect =
        playerRef.current?.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      const playerWidth = isMobile
        ? isExpanded
          ? 280
          : 48
        : isExpanded
        ? 320
        : 48;
      const playerHeight = isMobile
        ? isExpanded
          ? 158
          : 48
        : isExpanded
        ? 180
        : 48;

      let newX = clientX - parentRect.left - offset.current.x;
      let newY = clientY - parentRect.top - offset.current.y;

      newX = Math.max(0, Math.min(newX, parentRect.width - playerWidth));
      newY = Math.max(0, Math.min(newY, parentRect.height - playerHeight));

      setPosition({ x: newX, y: newY });
    };

    const handleInteractionEnd = () => setDragging(false);

    if (dragging) {
      window.addEventListener("mousemove", handleInteractionMove);
      window.addEventListener("mouseup", handleInteractionEnd);
      window.addEventListener("touchmove", handleInteractionMove);
      window.addEventListener("touchend", handleInteractionEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleInteractionMove);
      window.removeEventListener("mouseup", handleInteractionEnd);
      window.removeEventListener("touchmove", handleInteractionMove);
      window.removeEventListener("touchend", handleInteractionEnd);
    };
  }, [dragging, isMobile, isExpanded]);

  useEffect(() => {
    setIsExpanded(false);
    setPlaying(false);
    if (!initialPosition) {
      setPosition({ x: 50, y: 50 });
    }
  }, [videoUrl, initialPosition]);

  const currentUser = getCurrentUser();
  const isAdminViewer =
    !isAdminMode && currentUser && currentUser.role === "admin";

  const handleIconClick = (e) => {
    e.stopPropagation();
    if (!hasDragged) {
      setIsExpanded(true);
      setTimeout(() => {
        setPosition((prev) => constrainPosition(prev, true));
      }, 0);
    }
    setHasDragged(false);
  };

  const handleVideoAreaClick = (e) => {
    e.stopPropagation();
    if (!hasDragged) {
      setPlaying(true);
    }
    setHasDragged(false);
  };

  if (!isExpanded) {
    return (
      <Box
        ref={playerRef}
        onMouseDown={handleInteractionStart}
        onTouchStart={handleInteractionStart}
        sx={{
          position: "absolute",
          top: position.y,
          left: position.x,
          zIndex: 999,
          cursor: dragging ? "grabbing" : "grab",
          border: isAdminMode ? "2px solid yellow" : "none",
          borderRadius: "50%",
          touchAction: "none",
        }}
      >
        <IconButton
          onClick={handleIconClick}
          sx={{
            color: "white",
            backgroundColor: "rgba(0,0,0,0.6)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
            p: { xs: 0.75, sm: 1 },
          }}
        >
          <PlayCircleOutline sx={{ fontSize: { xs: 36, sm: 48 } }} />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      ref={playerRef}
      onMouseDown={handleInteractionStart}
      onTouchStart={handleInteractionStart}
      sx={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: { xs: 280, sm: 320 },
        height: { xs: 158, sm: 180 },
        zIndex: 999,
        cursor: isAdminViewer ? "default" : dragging ? "grabbing" : "grab",
        bgcolor: "black",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        border: isAdminMode ? "2px solid yellow" : "none",
        touchAction: "none",
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
            fontSize: { xs: 40, sm: 50 },
            cursor: "pointer",
          }}
          onClick={handleVideoAreaClick}
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
              p: { xs: 0.5, sm: 0.75 },
            }}
          >
            <Close fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

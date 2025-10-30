import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";
import { updateUserPlayerPosition } from "../../services/bookService";
import { getCurrentUser } from "../../services/authService";

export default function DraggableAudioPlayer({
  audioSrc,
  bookId,
  pageNumber,
  initialPosition,
  isAdminMode = false,
  onPositionChange,
  isMobile = false,
}) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const [position, setPosition] = useState(initialPosition || { x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnded = () => setPlaying(false);
    const handleError = () => {
      setError("Failed to load audio");
      setPlaying(false);
    };
    const handleCanPlay = () => setError(null);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [audioSrc]);

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  useEffect(() => {
    if (!dragging && position) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          if (isAdminMode) {
            if (onPositionChange) {
              onPositionChange({ audio_position: position });
            }
          } else {
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.role !== "admin") {
              await updateUserPlayerPosition(bookId, pageNumber, {
                audio_position: position,
              });
            }
          }
        } catch (err) {
          console.error("Failed to save audio position:", err);
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
    if (e.target.closest("button")) return;

    const clientX = e.type.startsWith("touch")
      ? e.touches[0].clientX
      : e.clientX;
    const clientY = e.type.startsWith("touch")
      ? e.touches[0].clientY
      : e.clientY;

    setDragging(true);
    dragStart.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
    e.preventDefault();
  };

  const handleInteractionMove = (e) => {
    if (!dragging) return;

    const clientX = e.type.startsWith("touch")
      ? e.touches[0].clientX
      : e.clientX;
    const clientY = e.type.startsWith("touch")
      ? e.touches[0].clientY
      : e.clientY;

    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const playerWidth = isMobile ? 180 : 200;
    let newX = clientX - dragStart.current.x;
    let newY = clientY - dragStart.current.y;

    newX = Math.max(0, Math.min(newX, parentRect.width - playerWidth));
    newY = Math.max(0, Math.min(newY, parentRect.height - 50));

    setPosition({ x: newX, y: newY });
  };

  const handleInteractionEnd = () => setDragging(false);

  const togglePlay = async (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    try {
      if (playing) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (err) {
      setError("Playback failed: " + err.message);
      setPlaying(false);
    }
  };

  if (!audioSrc) return null;

  const currentUser = getCurrentUser();
  const isAdminViewer =
    !isAdminMode && currentUser && currentUser.role === "admin";

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: { xs: 90, sm: 130 },
        p: { xs: 0.75, sm: 1 },
        bgcolor: "rgba(0,0,0,0.8)",
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        zIndex: 100,
        border: error
          ? "1px solid red"
          : isAdminMode
          ? "2px solid yellow"
          : "none",
        touchAction: "none",
      }}
      onMouseDown={handleInteractionStart}
      onMouseMove={handleInteractionMove}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchMove={handleInteractionMove}
      onTouchEnd={handleInteractionEnd}
    >
      <audio ref={audioRef} preload="metadata" style={{ display: "none" }}>
        <source src={audioSrc} type="audio/mpeg" />
        <source src={audioSrc} type="audio/wav" />
        <source src={audioSrc} type="audio/ogg" />
        Your browser does not support audio
      </audio>

      <IconButton
        onClick={togglePlay}
        sx={{
          color: "white",
          p: { xs: 0.3, sm: 0.5 },
          "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
        }}
      >
        {playing ? (
          <Pause fontSize={isMobile ? "small" : "medium"} />
        ) : (
          <PlayArrow fontSize={isMobile ? "small" : "medium"} />
        )}
      </IconButton>

      <Box
        sx={{
          ml: 1,
          color: "white",
          fontSize: { xs: 10, sm: 12 },
          flexGrow: 1,
        }}
      >
        {"Audio"}
      </Box>

      {error && (
        <Box sx={{ color: "red", fontSize: { xs: 9, sm: 10 }, mt: 0.5 }}>
          {error}
        </Box>
      )}
    </Box>
  );
}

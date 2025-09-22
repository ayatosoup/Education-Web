import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";

export default function DraggableAudioPlayer({ audioSrc }) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Audio event listeners
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

  // Drag handlers
  const handleMouseDown = (e) => {
    if (e.target.closest("button")) return; // Ignore clicks on buttons
    setDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    let newX = e.clientX - dragStart.current.x;
    let newY = e.clientY - dragStart.current.y;

    // Constrain inside parent
    newX = Math.max(0, Math.min(newX, parentRect.width - 200));
    newY = Math.max(0, Math.min(newY, parentRect.height - 50));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => setDragging(false);

  // Toggle play/pause
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

  // Optional debug function (comment out in production)
  /*
  const debugBlobContent = async () => {
    try {
      const response = await fetch(audioSrc);
      const blob = await response.blob();
      console.log("Blob info:", { size: blob.size, type: blob.type, url: audioSrc });
    } catch (err) {
      console.error("Blob debug error:", err);
    }
  };
  */

  if (!audioSrc) return null;

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: 200,
        p: 1,
        bgcolor: "rgba(0,0,0,0.8)",
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        zIndex: 100,
        border: error ? "1px solid red" : "none",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
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
          p: 0.5,
          "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
        }}
      >
        {playing ? <Pause /> : <PlayArrow />}
      </IconButton>

      <Box sx={{ ml: 1, color: "white", fontSize: 12, flexGrow: 1 }}>
        {error ? "Error" : "Audio"}
      </Box>

      {error && <Box sx={{ color: "red", fontSize: 10, mt: 0.5 }}>{error}</Box>}
    </Box>
  );
}

import React, { useRef, useEffect } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function BookCard({ book }) {
  const coverPage = book.pages?.find((page) => page.page_number === 1);
  const coverImageUrl = coverPage
    ? `${API_BASE_URL}/books/pages/${book.id}/${coverPage.page_path
        .split("/")
        .pop()}`
    : "/img/placeholder_cover.jpg";

  const canvasRef = useRef(null);

  useEffect(() => {
    // Display image on canvas with high resolution
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    context.scale(dpr, dpr);

    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = coverImageUrl;
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, rect.width, rect.height);
    };
  }, [coverImageUrl]);

  return (
    <Link to={`/book/${book.id}`} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          width: 200,
          height: 350,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: 2,
          borderRadius: 2,
          overflow: "hidden",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: 4,
          },
        }}
      >
        <Box
          component="canvas"
          ref={canvasRef}
          width={200}
          height={250}
          sx={{
            display: "block",
            flexShrink: 0,
            pointerEvents: "none",
          }}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" noWrap>
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {book.category_name}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

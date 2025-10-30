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
          width: "100%",
          maxWidth: 200,
          height: { xs: 280, sm: 350 },
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
          mx: "auto",
        }}
      >
        <Box
          component="canvas"
          ref={canvasRef}
          sx={{
            display: "block",
            width: "100%",
            height: { xs: 180, sm: 250 },
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
            p: { xs: 1.5, sm: 2 },
          }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            {book.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            {book.category_name}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

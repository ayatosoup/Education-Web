import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function BookCard({ book }) {
  const coverPage = book.pages?.find((page) => page.page_number === 1);
  const coverImageUrl = coverPage
    ? `${API_BASE_URL}/books/pages/${book.id}/${coverPage.page_path
        .split("/")
        .pop()}`
    : "/img/placeholder_cover.jpg";

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
        <CardMedia
          component="img"
          image={coverImageUrl}
          alt={book.title}
          sx={{ height: 250, objectFit: "cover" }}
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

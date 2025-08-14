import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <Link to={`/book/${book.id}`} style={styles.link}>
      <Card sx={styles.card}>
        <CardMedia
          component="img"
          height="300"
          image={book.cover}
          alt={book.title}
        />
        <CardContent>
          <Typography variant="h6">{book.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {book.author}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

const styles = {
  link: {
    textDecoration: "none",
  },
  card: {
    boxShadow: 2,
    borderRadius: 2,
    overflow: "hidden",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: 4,
    },
  },
};

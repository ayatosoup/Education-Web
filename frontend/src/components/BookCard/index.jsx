import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <Link to={`/book/${book.id}`} style={styles.link}>
      <Card sx={styles.card}>
        <CardMedia
          component="img"
          image={book.cover}
          alt={book.title}
          sx={styles.media}
        />
        <CardContent sx={styles.content}>
          <Typography variant="h6" noWrap>
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
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
  },
  media: {
    height: 250,
    objectFit: "cover",
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
};

import React from "react";
import { Grid } from "@mui/material";
import BookCard from "../BookCard";

// Book Data
const BOOKS = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "/img/book1_cover.jpg",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    cover: "/img/book2_cover.jpg",
  },
  {
    id: 3,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "/img/book3_cover.jpg",
  },
  {
    id: 4,
    title: "Babel",
    author: "R.F. Kuang",
    cover: "/img/book4_cover.jpg",
  },
];

export default function BookList() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Book Library</h1>
      <p style={styles.subtitle}>Browse your collection of books below.</p>

      <Grid container spacing={2} style={styles.grid}>
        {BOOKS.map((book) => (
          <Grid item xs={6} sm={4} md={3} key={book.id}>
            <BookCard book={book} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },
  title: {
    marginBottom: "4px",
  },
  subtitle: {
    marginTop: 0,
    color: "#555",
  },
  grid: {
    marginTop: "20px",
  },
};

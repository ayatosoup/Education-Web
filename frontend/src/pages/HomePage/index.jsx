// pages/BookList.js

import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import BookCard from "../../components/BookCard";
import { getAllBooks, getBookById } from "../../services/bookService"; // import functions directly

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        const bookList = await getAllBooks();
        const detailedBooksData = await Promise.all(
          bookList.map((book) => getBookById(book.id))
        );
        setBooks(detailedBooksData);
      } catch (err) {
        setError(err.message || "An error occurred while fetching books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooksData();
  }, []);

  const searchedBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={3}>
      <Box mb={2}>
        <Typography variant="h4" gutterBottom>
          Your Book Library
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Browse your collection of books below.
        </Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        gap={2}
        mb={3}
      >
        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          sx={{ textTransform: "none" }}
        >
          Filter
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && !error && (
        <Grid container spacing={2}>
          {searchedBooks.map((book) => (
            <Grid item xs={6} sm={4} md={3} key={book.id}>
              <BookCard book={book} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

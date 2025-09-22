import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import BookCard from "../../components/BookCard";
import { getAllCategories } from "../../services/categoryService";
import { getMyBooks, getBookById } from "../../services/bookService";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookList, categoryList] = await Promise.all([
          getMyBooks(), // only books the user can access
          getAllCategories(), // categories for filter
        ]);

        // fetch detailed info for each book (with pages and category)
        const detailedBooks = await Promise.all(
          bookList.map((book) => getBookById(book.id))
        );

        setBooks(detailedBooks);
        setCategories(categoryList);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = selectedCategory
      ? book.category_id === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

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

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          {filteredBooks.map((book) => (
            <Grid item xs={6} sm={4} md={3} key={book.id}>
              <BookCard book={book} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

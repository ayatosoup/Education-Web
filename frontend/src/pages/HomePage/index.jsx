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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import BookCard from "../../components/BookCard";
import { getAllCategories } from "../../services/categoryService";
import { getAllBooks, getMyBooks } from "../../services/bookService";
import { isAuthenticated, getCurrentUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const categoryList = await getAllCategories();
        setCategories(categoryList);

        if (!isAuthenticated()) {
          // belum login → lihat semua buku
          const allBooks = await getAllBooks();
          setBooks(allBooks);
        } else {
          const user = getCurrentUser();
          if (user?.role === "admin") {
            // admin login → lihat semua buku
            const allBooks = await getAllBooks();
            setBooks(allBooks);
          } else {
            // user biasa login → hanya buku dengan akses
            const myBooks = await getMyBooks();
            setBooks(myBooks);
          }
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleBookClick = (bookId) => {
    if (!isAuthenticated()) {
      setShowLoginNotice(true);
    } else {
      navigate(`/book/${bookId}`);
    }
  };

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
          Book Library
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Browse the collection of books below.
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

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={2}>
          {filteredBooks.map((book) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              key={book.id}
              onClick={() => handleBookClick(book.id)}
              style={{ cursor: "pointer" }}
            >
              <BookCard book={book} />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={showLoginNotice}
        onClose={() => setShowLoginNotice(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Login Diperlukan</DialogTitle>
        <DialogContent>
          <Typography>
            Anda harus login terlebih dahulu untuk membuka buku ini.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowLoginNotice(false)}
            variant="contained"
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

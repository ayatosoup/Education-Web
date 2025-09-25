import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { getAllBooks, getBookById } from "../../services/bookService";
import { getAllCategories } from "../../services/categoryService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function BookManagement() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookList, categoryList] = await Promise.all([
          getAllBooks(),
          getAllCategories(),
        ]);
        setBooks(bookList);
        setCategories(categoryList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleEditClick = async (bookId) => {
    try {
      const book = await getBookById(bookId);
      setEditBook(book);
      setOpenDialog(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSave = async () => {
    if (!editBook) return;
    try {
      const response = await fetch(`${API_BASE_URL}/books/${editBook.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: editBook.title,
          description: editBook.description,
          category_id: editBook.category_id,
        }),
      });

      if (!response.ok) throw new Error("Failed to update book.");
      alert("Book updated successfully.");
      setOpenDialog(false);
      setBooks((prev) =>
        prev.map((b) => (b.id === editBook.id ? editBook : b))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (bookId) => {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete book.");
      alert("Book deleted successfully.");
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manage Books
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={2}>
          {books.map((book) => (
            <Grid
              item
              xs={12}
              md={6}
              key={book.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "6px",
              }}
            >
              <Typography>{book.title}</Typography>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleEditClick(book.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(book.id)}
                >
                  Delete
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={editBook?.title || ""}
            onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={editBook?.description || ""}
            onChange={(e) =>
              setEditBook({ ...editBook, description: e.target.value })
            }
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={editBook?.category_id || ""}
              onChange={(e) =>
                setEditBook({ ...editBook, category_id: e.target.value })
              }
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

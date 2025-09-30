import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Delete, MenuBook } from "@mui/icons-material";
import {
  getAllBooks,
  updateBook,
  deleteBook,
  getCategories,
} from "../../services/bookService";

export default function AdminBooksPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllBooks();
      setBooks(data);
    } catch (err) {
      setError(err.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err.message);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingBook) return;

    try {
      await updateBook(editingBook.id, {
        title: form.title,
        description: form.description,
        category_id: form.category, // send ID
      });
      await fetchBooks();
      setForm({ title: "", description: "", category: "" });
      setEditingBook(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(id);
      fetchBooks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      description: book.description,
      category: book.category_id, // use ID
    });
  };

  const handleViewPages = (bookId) => {
    navigate(`/admin/books/${bookId}/pages`);
  };

  const filteredBooks = books.filter((book) => {
    const categoryName =
      categories.find((c) => c.id === book.category_id)?.name || "";
    return (
      (book.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (book.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin – Manage Books
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Create, edit, delete books and manage their content.
      </Typography>

      {/* Create Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box />
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/admin/books/create")}
        >
          Create New Book
        </Button>
      </Box>

      {/* Edit Book Form */}
      {editingBook && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Edit Book
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              display="flex"
              gap={2}
              flexWrap="wrap"
              alignItems="end"
            >
              <TextField
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                size="small"
              />
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                size="small"
                sx={{ minWidth: 200 }}
              />
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={form.category}
                  label="Category"
                  onChange={handleChange}
                  required
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => {
                  setEditingBook(null);
                  setForm({ title: "", description: "", category: "" });
                }}
              >
                Cancel
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      <Box mb={3}>
        <TextField
          label="Search books..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          placeholder="Search by title, description, or category"
        />
      </Box>

      {/* Loading / Error */}
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

      {/* Books Table */}
      {!loading && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Pages</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.map((book) => {
                const categoryName =
                  categories.find((c) => c.id === book.category_id)?.name ||
                  "Unknown";
                return (
                  <TableRow key={book.id}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {book.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 250,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {book.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={categoryName}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<MenuBook />}
                        onClick={() => handleViewPages(book.id)}
                      >
                        Manage
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEdit(book)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(book.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

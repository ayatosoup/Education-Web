import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import BookCard from "../../components/BookCard";
import { getAllBooks } from "../../services/bookService";
import { getAllUsers, giveBookAccess, getUserBooks } from "../../services/userService";
import { getAllCategories } from "../../services/categoryService";

export default function UserManagement() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingUserBooks, setLoadingUserBooks] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookList, userListResponse, categoryList] = await Promise.all([
          getAllBooks(),
          getAllUsers(),
          getAllCategories(),
        ]);
        setBooks(bookList);
        setCategories(categoryList);
        const rawUsers = Array.isArray(userListResponse)
          ? userListResponse
          : userListResponse.data ?? [];
        setUsers(rawUsers.filter((u) => u.role !== "admin"));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setLoadingUserBooks(true);
      getUserBooks(selectedUser)
        .then((data) => {
          const userBookIds = Array.isArray(data.books) ? data.books : data;
          setSelectedBooks(userBookIds);
        })
        .catch(console.error)
        .finally(() => setLoadingUserBooks(false));
    } else {
      setSelectedBooks([]);
    }
  }, [selectedUser]);

  const handleToggleBook = (bookId) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    try {
      setSaving(true);
      await giveBookAccess(selectedUser, selectedBooks);
      alert("Book access saved successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory
      ? book.category_id === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={2}>
        Browse the collection of books below.
      </Typography>

      <Box display="flex" gap={2} alignItems="center" mb={3} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser}
            label="Select User"
            onChange={(e) => setSelectedUser(Number(e.target.value))}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} ({user.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!selectedUser || saving}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : selectedUser ? (
        <>
          <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
            <TextField
              size="small"
              placeholder="Search..."
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

          {loadingUserBooks ? (
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress size={30} />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredBooks.map((book) => (
                <Grid item xs={6} sm={4} md={3} key={book.id}>
                  <BookCard
                    book={book}
                    selectable={true}
                    selected={selectedBooks.includes(book.id)}
                    onSelect={() => handleToggleBook(book.id)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      ) : (
        <Typography color="text.secondary" mt={3}>
          Pilih user terlebih dahulu untuk menampilkan buku.
        </Typography>
      )}
    </Box>
  );
}

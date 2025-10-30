import React, { useEffect, useState } from "react";
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
import { Edit, Delete } from "@mui/icons-material";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserBooks,
  giveBookAccess,
  removeBookAccess,
} from "../../services/userService";
import { getAllBooks } from "../../services/bookService";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const [userList, bookList] = await Promise.all([
        getUsers(),
        getAllBooks(),
      ]);
      const usersWithBooks = await Promise.all(
        userList.map(async (u) => {
          const books = await getUserBooks(u.id);
          return { ...u, books };
        })
      );
      setUsers(usersWithBooks);
      setAllBooks(bookList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, form);
      } else {
        await createUser(form);
      }
      await fetchUsers();
      setForm({ name: "", email: "", password: "", role: "student" });
      setEditingUser(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
  };

  const handleAssignBook = async (userId, bookId) => {
    try {
      await giveBookAccess(userId, bookId);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRevokeBook = async (userId, bookId) => {
    try {
      await removeBookAccess(userId, bookId);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin – Manage Users
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Create, edit, delete users and manage their book access.
      </Typography>

      {/* User Form */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {editingUser ? "Edit User" : "Create New User"}
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
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              label={
                editingUser ? "Password (leave blank to keep)" : "Password"
              }
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required={!editingUser}
              size="small"
            />
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={form.role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              {editingUser ? "Update" : "Create"}
            </Button>
            {editingUser && (
              <Button
                type="button"
                variant="outlined"
                onClick={() => {
                  setEditingUser(null);
                  setForm({
                    name: "",
                    email: "",
                    password: "",
                    role: "student",
                  });
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Box mb={3}>
        <TextField
          label="Search users..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          placeholder="Search by name or email"
        />
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

      {/* Users Table */}
      {!loading && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Book Access</TableCell>
                <TableCell>Assign Book</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={user.role === "admin" ? "primary" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {user.role === "admin" ? (
                      <Chip label="ALL" color="success" size="small" />
                    ) : (
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {user.books && user.books.length > 0 ? (
                          user.books.map((book) => (
                            <Chip
                              key={book.id}
                              label={book.title}
                              onDelete={() =>
                                handleRevokeBook(user.id, book.id)
                              }
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No books
                          </Typography>
                        )}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.role !== "admin" && (
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                          value=""
                          displayEmpty
                          onChange={(e) =>
                            handleAssignBook(user.id, e.target.value)
                          }
                        >
                          <MenuItem value="" disabled>
                            Select book
                          </MenuItem>
                          {allBooks.map((book) => (
                            <MenuItem key={book.id} value={book.id}>
                              {book.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

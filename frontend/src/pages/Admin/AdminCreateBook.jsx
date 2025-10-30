import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createBook, getCategories } from "../../services/bookService";
import { getCurrentUser } from "../../services/authService";

export default function CreateBookPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    pdf_file: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = getCurrentUser();
      if (!user) throw new Error("Not authenticated");

      await createBook({
        ...formData,
        uploaded_by: user.id,
      });

      navigate("/admin/books");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create New Book
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            select
            fullWidth
            label="Category"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            margin="normal"
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload PDF
            <input
              type="file"
              name="pdf_file"
              accept="application/pdf"
              hidden
              onChange={handleChange}
            />
          </Button>
          {formData.pdf_file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {formData.pdf_file.name}
            </Typography>
          )}

          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Create Book"}
            </Button>
            <Button
              sx={{ ml: 2 }}
              variant="outlined"
              onClick={() => navigate("/admin/books")}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

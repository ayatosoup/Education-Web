import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getCurrentUser } from "../../services/authService";
import { getAllCategories } from "../../services/categoryService";
import { uploadBook } from "../../services/bookService";

export default function UploadBook() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const user = getCurrentUser();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getAllCategories();
        setCategories(cats);
      } catch (e) {
        setError("Gagal memuat kategori.");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      setError("Pilih file PDF terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category_id", categoryId);
      formData.append("pdf_file", pdfFile);
      formData.append("uploaded_by", user?.id);

      const result = await uploadBook(formData);
      setSuccess(`Buku berhasil diunggah (ID: ${result.book_id})`);
      setTitle("");
      setDescription("");
      setCategoryId("");
      setPdfFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Upload Buku
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <TextField
          label="Judul Buku"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Kategori</InputLabel>
          <Select
            value={categoryId}
            label="Kategori"
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
          Pilih PDF
          <input
            type="file"
            hidden
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
          />
        </Button>

        {pdfFile && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            File dipilih: {pdfFile.name}
          </Typography>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth>
          {loading ? <CircularProgress size={24} /> : "Upload Buku"}
        </Button>
      </form>
    </Box>
  );
}

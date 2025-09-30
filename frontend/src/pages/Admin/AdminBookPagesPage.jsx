import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Input,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  AudioFile,
  VideoLibrary,
  MenuBook,
} from "@mui/icons-material";
import {
  getBookById,
  updateBook,
  fetchBookTOC,
  createTOCEntry,
  updateTOCEntry,
  deleteTOCEntry,
} from "../../services/bookService";

export default function AdminBookPagesPage() {
  const { bookId } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const [tocEntries, setTocEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingPage, setEditingPage] = useState(null);
  const [editForm, setEditForm] = useState({
    audio_file: null,
    video_link: "",
    toc_title: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [details, toc] = await Promise.all([
        getBookById(bookId),
        fetchBookTOC(bookId),
      ]);
      setBookDetails(details);
      setTocEntries(toc);
    } catch (err) {
      setError(err.message || "Failed to load book details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bookId]);

  const getTOCForPage = (pageNumber) => {
    return tocEntries.find((toc) => toc.page_number === pageNumber);
  };

  const getPageData = (pageNumber) => {
    return bookDetails?.pages?.find((page) => page.page_number === pageNumber);
  };

  const handleEdit = (pageNumber) => {
    const pageData = getPageData(pageNumber);
    const tocData = getTOCForPage(pageNumber);

    setEditingPage(pageNumber);
    setEditForm({
      audio_file: null,
      video_link: pageData?.video_link || "",
      toc_title: tocData?.title || "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSave = async (pageNumber) => {
    try {
      const pageData = getPageData(pageNumber);
      const currentVideoLink = pageData?.video_link || "";

      const hasAudioFile = editForm.audio_file !== null;
      const videoLinkChanged = editForm.video_link !== currentVideoLink;

      if (hasAudioFile || videoLinkChanged) {
        const updateData = {
          page_number: pageNumber,
        };

        if (hasAudioFile) {
          updateData.audio_file = editForm.audio_file;
        }

        updateData.video_link = editForm.video_link;

        const result = await updateBook(bookId, updateData);
      }

      // Handle TOC
      const existingTOC = getTOCForPage(pageNumber);
      if (editForm.toc_title && editForm.toc_title.trim()) {
        const tocData = {
          title: editForm.toc_title.trim(),
          page_number: pageNumber,
        };

        if (existingTOC) {
          await updateTOCEntry(bookId, existingTOC.id, tocData);
        } else {
          await createTOCEntry(bookId, tocData);
        }
      } else if (
        existingTOC &&
        (!editForm.toc_title || !editForm.toc_title.trim())
      ) {
        await deleteTOCEntry(bookId, existingTOC.id);
      }

      setEditingPage(null);
      setEditForm({ audio_file: null, video_link: "", toc_title: "" });
      await fetchData();
    } catch (err) {
      console.error("Save error:", err);
      setError(`Failed to save changes: ${err.message}`);
    }
  };

  const handleCancel = () => {
    setEditingPage(null);
    setEditForm({ audio_file: null, video_link: "", toc_title: "" });
  };

  // Generate all pages based on bookDetails.pages or assume sequential numbering
  const allPages = bookDetails?.pages || [];
  const maxPageNumber = Math.max(...allPages.map((p) => p.page_number), 0);
  const pageNumbers = Array.from({ length: maxPageNumber }, (_, i) => i + 1);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manage Pages – {bookDetails?.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={3}>
        Edit audio files, video links, and table of contents for each page.
      </Typography>

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

      {/* Pages Table */}
      {!loading && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Page</TableCell>
                <TableCell>Audio</TableCell>
                <TableCell>Video Link</TableCell>
                <TableCell>Table of Contents</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageNumbers.map((pageNumber) => {
                const pageData = getPageData(pageNumber);
                const tocData = getTOCForPage(pageNumber);
                const isEditing = editingPage === pageNumber;

                return (
                  <TableRow key={pageNumber}>
                    <TableCell>
                      <Typography variant="h6" color="primary">
                        {pageNumber}
                      </Typography>
                    </TableCell>

                    {/* Audio Column */}
                    <TableCell>
                      {isEditing ? (
                        <Box>
                          <Input
                            type="file"
                            name="audio_file"
                            inputProps={{ accept: "audio/*" }}
                            onChange={handleFormChange}
                            sx={{ fontSize: 12 }}
                          />
                          {pageData?.audio_path && (
                            <Typography
                              variant="caption"
                              display="block"
                              color="text.secondary"
                            >
                              Current: {pageData.audio_path.split("/").pop()}
                            </Typography>
                          )}
                        </Box>
                      ) : pageData?.audio_path ? (
                        <Chip
                          icon={<AudioFile />}
                          label={pageData.audio_path.split("/").pop()}
                          color="success"
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No audio
                        </Typography>
                      )}
                    </TableCell>

                    {/* Video Link Column */}
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          name="video_link"
                          value={editForm.video_link}
                          onChange={handleFormChange}
                          placeholder="Enter video URL"
                          size="small"
                          fullWidth
                        />
                      ) : pageData?.video_link ? (
                        <Chip
                          icon={<VideoLibrary />}
                          label="Video Available"
                          color="info"
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            window.open(pageData.video_link, "_blank")
                          }
                          clickable
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No video
                        </Typography>
                      )}
                    </TableCell>

                    {/* TOC Column */}
                    <TableCell>
                      {isEditing ? (
                        <TextField
                          name="toc_title"
                          value={editForm.toc_title}
                          onChange={handleFormChange}
                          placeholder="Enter chapter/section title"
                          size="small"
                          fullWidth
                        />
                      ) : tocData ? (
                        <Chip
                          icon={<MenuBook />}
                          label={tocData.title}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No TOC
                        </Typography>
                      )}
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell align="center">
                      {isEditing ? (
                        <Box>
                          <IconButton
                            color="primary"
                            onClick={() => handleSave(pageNumber)}
                            size="small"
                          >
                            <Save />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={handleCancel}
                            size="small"
                          >
                            <Cancel />
                          </IconButton>
                        </Box>
                      ) : (
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(pageNumber)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                      )}
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

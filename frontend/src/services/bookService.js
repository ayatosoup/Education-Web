import { getToken, getCurrentUser } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Public / Shared Endpoints ---

export const getAllBooks = async () => {
  const response = await fetch(`${API_BASE_URL}/books`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch books.");
  return data;
};

export const getBookById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || `Failed to fetch book with id: ${id}`);
  return data;
};

export const getMyBooks = async () => {
  const user = getCurrentUser();

  if (user && user.role === "admin") {
    return getAllBooks();
  } else {
    const response = await fetch(`${API_BASE_URL}/my-books`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to fetch my books.");
    return data;
  }
};

// --- Admin Book Management ---

export const createBook = async (bookData) => {
  const formData = new FormData();
  formData.append("title", bookData.title);
  formData.append("description", bookData.description || "");
  formData.append("category_id", bookData.category_id);
  formData.append("uploaded_by", bookData.uploaded_by);
  if (bookData.pdf_file) {
    formData.append("pdf_file", bookData.pdf_file);
  }

  const response = await fetch(`${API_BASE_URL}/admin/books`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create book");
  return data;
};

export const updateBook = async (id, bookData) => {
  const formData = new FormData();

  if (bookData.title) formData.append("title", bookData.title);
  if (bookData.description !== undefined)
    formData.append("description", bookData.description);
  if (bookData.category_id)
    formData.append("category_id", bookData.category_id);
  if (bookData.pdf_file) formData.append("pdf_file", bookData.pdf_file);

  if (bookData.page_number !== undefined) {
    formData.append("page_number", bookData.page_number);

    // jika user upload audio baru
    if (bookData.audio_file) {
      formData.append("audio_file", bookData.audio_file);
    }

    // jika user ingin menghapus audio
    if (bookData.remove_audio !== undefined) {
      formData.append("remove_audio", bookData.remove_audio ? "1" : "0");
    }

    // video link tetap dikirim (bisa kosong)
    formData.append("video_link", bookData.video_link || "");
  }

  formData.append("_method", "PUT");

  const response = await fetch(`${API_BASE_URL}/admin/books/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Update book error:", data);
    throw new Error(data.message || data.error || "Failed to update book");
  }
  return data;
};

export const deleteBook = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/books/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete book");
  return data;
};

// --- Categories ---

export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to fetch categories");
  return data;
};

// Admin-only categories
export const createCategory = async (categoryData) => {
  const res = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(categoryData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create category");
  return data;
};

export const updateCategory = async (id, categoryData) => {
  const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(categoryData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update category");
  return data;
};

export const deleteCategory = async (id) => {
  const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete category");
  return data;
};

// --- TOC ---

export const fetchBookTOC = async (bookId) => {
  const res = await fetch(`${API_BASE_URL}/books/${bookId}/toc`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch TOC");
  return res.json();
};

export const createTOCEntry = async (bookId, tocData) => {
  const response = await fetch(`${API_BASE_URL}/admin/books/${bookId}/toc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(tocData),
  });

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to create TOC entry");
  return data;
};

export const updateTOCEntry = async (bookId, tocId, tocData) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/books/${bookId}/toc/${tocId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(tocData),
    }
  );

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to update TOC entry");
  return data;
};

export const deleteTOCEntry = async (bookId, tocId) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/books/${bookId}/toc/${tocId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Failed to delete TOC entry");
  return data;
};

export const fetchAudio = async (bookId, audioPath) => {
  const fullFileName = audioPath.split("/").pop();
  const fileNameWithoutExt = fullFileName.split(".").slice(0, -1).join(".");
  const url = `${API_BASE_URL}/books/audio/${bookId}/${fileNameWithoutExt}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch audio: ${res.status}`);
  return await res.blob();
};

import { getToken } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get annotations for a specific page
export const getPageAnnotations = async (bookId, pageNumber) => {
  const response = await fetch(
    `${API_BASE_URL}/books/${bookId}/annotations/${pageNumber}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch annotations.");
  }
  return data;
};

// Get all annotations for a book
export const getBookAnnotations = async (bookId) => {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}/annotations`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch book annotations.");
  }
  return data;
};

// Save or update annotations for a page
export const saveAnnotations = async (bookId, pageNumber, annotationPaths) => {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}/annotations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      page_number: pageNumber,
      annotation_paths: annotationPaths,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to save annotations.");
  }
  return data;
};

// Clear annotations for a specific page
export const clearPageAnnotations = async (bookId, pageNumber) => {
  const response = await fetch(
    `${API_BASE_URL}/books/${bookId}/annotations/${pageNumber}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to clear page annotations.");
  }
  return data;
};

// Clear all annotations for a book
export const clearBookAnnotations = async (bookId) => {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}/annotations`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to clear book annotations.");
  }
  return data;
};

// Delete a specific annotation path
export const deleteAnnotationPath = async (bookId, pageNumber, pathIndex) => {
  const response = await fetch(
    `${API_BASE_URL}/books/${bookId}/annotations/${pageNumber}/path`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ path_index: pathIndex }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to delete annotation path.");
  }
  return data;
};

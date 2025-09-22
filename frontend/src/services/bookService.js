import { getToken } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
};

export const fetchAudio = async (bookId, audioPath) => {
  const fileName = audioPath.split("/").pop();
  const url = `${API_BASE_URL}/books/audio/${bookId}/${fileName}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch audio: ${res.status}`);
  return await res.blob();
};

export async function fetchBookTOC(bookId) {
  const res = await fetch(`${API_BASE_URL}/books/${bookId}/toc`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch TOC");
  return res.json();
}

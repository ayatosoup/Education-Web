import { getToken } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllBooks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/books`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch books.");
    }

    return data;
  } catch (error) {
    console.error("getAllBooks error:", error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch book with id: ${id}`);
    }

    return data;
  } catch (error) {
    console.error(`getBookById error (id: ${id}):`, error);
    throw error;
  }
};

export const getMyBooks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/my-books`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch your books.");
    }

    return data;
  } catch (error) {
    console.error("getMyBooks error:", error);
    throw error;
  }
};

export const fetchAudio = async (bookId, audioPath) => {
  const fileName = audioPath.split("/").pop();
  const url = `${API_BASE_URL}/books/audio/${bookId}/${fileName}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch audio: ${res.status} ${res.statusText}`);
  }

  return await res.blob();
};

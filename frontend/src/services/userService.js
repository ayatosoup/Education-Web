import { getToken } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch users.");
  return data.data;
};

export const getUserBooks = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/books`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch user books.");
  return data.books;
};

export const giveBookAccess = async (userId, bookIds) => {
  const res = await fetch(`${API_BASE_URL}/users/sync-book-access`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ user_id: userId, book_ids: bookIds }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to sync book access.");
  return data;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  return data.data;
};

export const createUser = async (user) => {
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(user),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create user");
  return data.data;
};

export const updateUser = async (id, user) => {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(user),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update user");
  return data.data;
};

export const deleteUser = async (id) => {
  const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete user");
  return data;
};

export const getUserBooks = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/books`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch user books");

  if (typeof data.books[0] === "number" || data.books[0]?.book_id) {
    const detailed = await Promise.all(
      data.books.map((b) => getBookById(b.id || b.book_id || b))
    );
    return detailed;
  }

  return data.books;
};

export const giveBookAccess = async (userId, bookId) => {
  const res = await fetch(`${API_BASE_URL}/admin/users/give-book-access`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id: userId, book_id: bookId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to give access");
  return data;
};

export const removeBookAccess = async (userId, bookId) => {
  const res = await fetch(`${API_BASE_URL}/admin/users/remove-book-access`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id: userId, book_id: bookId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to remove access");
  return data;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed.");
  }

  // Simpan token
  localStorage.setItem("auth_token", data.token);

  // Ambil semua field yang dibutuhkan dari user
  const { id, email: userEmail, name, role } = data.user;

  // Simpan ke localStorage
  localStorage.setItem(
    "user",
    JSON.stringify({ id, email: userEmail, name, role })
  );

  return data;
};

export const logout = () => {
  const token = getToken();

  if (token) {
    fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(console.error);
  }

  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => !!localStorage.getItem("auth_token");

export const getToken = () => localStorage.getItem("auth_token");

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

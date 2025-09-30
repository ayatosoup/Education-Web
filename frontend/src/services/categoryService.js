import { getToken } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch categories.");
    }

    return data;
  } catch (error) {
    console.error("getAllCategories error:", error);
    throw error;
  }
};

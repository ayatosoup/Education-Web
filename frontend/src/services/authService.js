// services/authService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class AuthService {
  constructor() {
    this.token = localStorage.getItem("auth_token");
  }

  // Set authorization header for requests
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Login method
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        this.token = data.token;
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        return {
          success: true,
          user: data.user,
          token: data.token,
        };
      } else {
        return {
          success: false,
          message: data.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  // Logout method
  async logout() {
    try {
      if (this.token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: "POST",
          headers: this.getHeaders(),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API call success
      this.token = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  // Get current token
  getToken() {
    return this.token;
  }
}

// Export a singleton instance
export default new AuthService();

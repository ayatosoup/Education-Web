// services/BookService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class BookService {
  async getBooks() {
    try {
      const res = await fetch(`${API_BASE_URL}/books`);
      const data = await res.json();
      return { success: true, books: data };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Failed to fetch books" };
    }
  }

  async getBookPages(bookId) {
    try {
      const res = await fetch(`${API_BASE_URL}/books/${bookId}`);
      const book = await res.json();
      if (!book.pages) throw new Error("No pages found");

      const pages = book.pages.map((p) => ({
        pageNumber: p.page_number,
        url: `${API_BASE_URL}/storage/${p.page_path}`,
      }));

      return { success: true, pages };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Failed to fetch book pages" };
    }
  }
}

export default new BookService();

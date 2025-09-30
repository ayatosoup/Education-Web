import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Headbar from "./components/Headbar";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import BookViewer from "./components/BookViewer";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminBooksPage from "./pages/Admin/AdminBooksPage";
import AdminBookPagesPage from "./pages/Admin/AdminBookPagesPage";
import CreateBookPage from "./pages/Admin/AdminCreateBook";
import AccountDetailPage from "./pages/AccountDetailPage";

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const isBookViewerPage = location.pathname.startsWith("/book/");

  const hideLayout = isLoginPage || isBookViewerPage;

  return (
    <>
      {!hideLayout && <Headbar />}
      {!hideLayout && <Sidebar />}
      <main
        style={{
          padding: hideLayout ? "0" : "20px",
          marginLeft: hideLayout ? "0" : "250px",
          marginTop: hideLayout ? "0" : "60px",
          minHeight: hideLayout ? "100vh" : "calc(100vh - 60px)",
        }}
      >
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/books" element={<HomePage />} />
          <Route path="/book/:id" element={<BookViewer />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/books" element={<AdminBooksPage />} />
          <Route path="/admin/books/create" element={<CreateBookPage />} />
          <Route
            path="/admin/books/:bookId/pages"
            element={<AdminBookPagesPage />}
          />
          <Route path="/account" element={<AccountDetailPage />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
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
import { isAuthenticated, getCurrentUser } from "./services/authService";
import AdminPlayerPositionPage from "./pages/Admin/AdminPlayerPositionPage";

function PublicRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/books" replace />;
  }
  return children;
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    return <Navigate to="/books" replace />;
  }
  return children;
}

function AppContent() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isLoginPage =
    location.pathname === "/" || location.pathname === "/login";
  const isBookViewerPage = location.pathname.startsWith("/book/");
  const isAdminPlayerPositionPage = location.pathname.includes("/position");

  const hideLayout =
    isLoginPage || isBookViewerPage || isAdminPlayerPositionPage;

  return (
    <>
      {!hideLayout && <Headbar />}
      {!hideLayout && <Sidebar />}
      <main
        style={{
          padding: hideLayout ? "0" : isMobile ? "12px" : "20px",
          marginLeft: hideLayout || isMobile ? "0" : "250px",
          marginTop: hideLayout ? "0" : "60px",
          minHeight: hideLayout ? "100vh" : "calc(100vh - 60px)",
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute>
                <BookViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <AdminRoute>
                <AdminBooksPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books/create"
            element={
              <AdminRoute>
                <CreateBookPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books/:bookId/pages"
            element={
              <AdminRoute>
                <AdminBookPagesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books/:id/pages/:pageNumber/position"
            element={<AdminPlayerPositionPage />}
          />
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

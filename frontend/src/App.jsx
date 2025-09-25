import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Headbar from "./components/Headbar";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import BookViewer from "./components/BookViewer";
import UploadBook from "./pages/UploadBook";
import UserManagement from "./pages/UserManagement";
import BookManagement from "./pages/BookManagement";
import { isAuthenticated, getCurrentUser } from "./services/authService";

function ProtectedRoute({ children, requireAdmin = false }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const user = getCurrentUser(); // ambil dari localStorage (authService)
  if (requireAdmin && (!user || user.role !== "admin")) {
    return <Navigate to="/books" replace />;
  }

  return children;
}

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
          <Route
            path="/"
            element={
              isAuthenticated() ? <Navigate to="/books" replace /> : <LoginPage />
            }
          />
          <Route path="/books" element={<HomePage />} />
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute>
                <BookViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-book"
            element={
              <ProtectedRoute requireAdmin>
                <UploadBook />
              </ProtectedRoute>
            }
          />
          <Route
  path="/manage-books"
  element={
    <ProtectedRoute requireAdmin>
      <BookManagement />
    </ProtectedRoute>
  }
/>
          <Route
            path="/user-management"
            element={
              <ProtectedRoute requireAdmin>
                <UserManagement />
              </ProtectedRoute>
            }
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

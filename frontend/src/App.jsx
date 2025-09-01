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

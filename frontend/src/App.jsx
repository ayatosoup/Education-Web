import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Headbar from "./components/Headbar";
import LoginPage from "./pages/LoginPage";
import BookList from "./components/Booklist";
import BookViewer from "./components/BookViewer";

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <>
      {!isLoginPage && <Headbar />}
      <main style={{ padding: isLoginPage ? "0" : "20px" }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/books" element={<BookList />} />
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

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Headbar from "./components/Headbar";
import BookList from "./components/Booklist";
import BookViewer from "./components/BookViewer";

export default function App() {
  return (
    <Router>
      <Headbar />
      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/book/:id" element={<BookViewer />} />
        </Routes>
      </main>
    </Router>
  );
}

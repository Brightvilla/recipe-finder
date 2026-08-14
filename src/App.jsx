import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import Favorites from "./pages/Favorites";
import { FavoritesProvider } from "./context/FavoritesContext";

export default function App() {
  return (
    <FavoritesProvider>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
      <footer className="app-footer">
        Recipe data courtesy of{" "}
        <a href="https://www.themealdb.com/" target="_blank" rel="noreferrer">
          TheMealDB
        </a>
        .
      </footer>
    </FavoritesProvider>
  );
}

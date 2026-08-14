import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { searchMealsByName, getRandomMeal } from "../api/mealdb";

const STARTER_TERMS = ["chicken", "pasta", "cake", "soup", "curry"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error | empty
  const [errorMessage, setErrorMessage] = useState("");

  async function runSearch(term) {
    setQuery(term);
    setStatus("loading");
    setErrorMessage("");
    try {
      const results = await searchMealsByName(term);
      setMeals(results);
      setStatus(results.length > 0 ? "success" : "empty");
    } catch (err) {
      setErrorMessage(err.message || "Please check your connection and try again.");
      setStatus("error");
    }
  }

  async function loadInspiration() {
    setStatus("loading");
    setErrorMessage("");
    try {
      const requests = Array.from({ length: 6 }, () => getRandomMeal());
      const results = await Promise.all(requests);
      const unique = Array.from(
        new Map(results.filter(Boolean).map((meal) => [meal.idMeal, meal])).values()
      );
      setMeals(unique);
      setStatus(unique.length > 0 ? "success" : "empty");
    } catch (err) {
      setErrorMessage(err.message || "Please check your connection and try again.");
      setStatus("error");
    }
  }

  useEffect(() => {
    loadInspiration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="page">
      <div className="page__intro">
        <p className="page__eyebrow">The Recipe Ledger</p>
        <h1 className="page__heading">Find something worth cooking tonight.</h1>
        <p className="page__subheading">
          Search thousands of recipes, then pin your favorites to a personal
          recipe box you can come back to anytime.
        </p>
      </div>

      <SearchBar onSearch={runSearch} initialValue={query} />

      <div className="chip-row">
        {STARTER_TERMS.map((term) => (
          <button
            key={term}
            type="button"
            className="chip"
            onClick={() => runSearch(term)}
          >
            {term}
          </button>
        ))}
        <button type="button" className="chip chip--ghost" onClick={loadInspiration}>
          ↻ Surprise me
        </button>
      </div>

      {status === "loading" && <Loading />}

      {status === "error" && (
        <ErrorMessage
          message={errorMessage}
          onRetry={() => (query ? runSearch(query) : loadInspiration())}
        />
      )}

      {status === "empty" && (
        <div className="status-block">
          <p className="status-block__title">No recipes found</p>
          <p>Try a different ingredient or dish name, like “beef” or “rice”.</p>
        </div>
      )}

      {status === "success" && (
        <div className="recipe-grid">
          {meals.map((meal) => (
            <RecipeCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { getMealById, extractIngredients } from "../api/mealdb";
import { useFavorites } from "../context/FavoritesContext";

export default function RecipeDetail() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  async function loadMeal() {
    setStatus("loading");
    setErrorMessage("");
    try {
      const result = await getMealById(id);
      if (!result) {
        setStatus("empty");
        return;
      }
      setMeal(result);
      setStatus("success");
    } catch (err) {
      setErrorMessage(err.message || "Please check your connection and try again.");
      setStatus("error");
    }
  }

  useEffect(() => {
    loadMeal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (status === "loading") return <Loading label="Loading recipe…" />;
  if (status === "error") {
    return <ErrorMessage message={errorMessage} onRetry={loadMeal} />;
  }
  if (status === "empty" || !meal) {
    return (
      <div className="status-block">
        <p className="status-block__title">Recipe not found</p>
        <Link to="/" className="status-block__retry">
          Back to search
        </Link>
      </div>
    );
  }

  const ingredients = extractIngredients(meal);
  const saved = isFavorite(meal.idMeal);
  const instructions = meal.strInstructions
    ? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim())
    : [];

  return (
    <article className="recipe-detail">
      <Link to="/" className="recipe-detail__back">
        ← Back to search
      </Link>

      <div className="recipe-detail__header">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="recipe-detail__image"
        />
        <div className="recipe-detail__intro">
          <p className="page__eyebrow">
            {[meal.strCategory, meal.strArea].filter(Boolean).join(" · ")}
          </p>
          <h1 className="recipe-detail__title">{meal.strMeal}</h1>
          <button
            type="button"
            className={
              saved
                ? "recipe-card__save recipe-card__save--active"
                : "recipe-card__save"
            }
            onClick={() => toggleFavorite(meal)}
            aria-pressed={saved}
          >
            {saved ? "★ Saved to your box" : "☆ Save to your box"}
          </button>
          {meal.strYoutube && (
            <a
              href={meal.strYoutube}
              target="_blank"
              rel="noreferrer"
              className="recipe-detail__video-link"
            >
              ▶ Watch video
            </a>
          )}
        </div>
      </div>

      <div className="recipe-detail__body">
        <div className="recipe-detail__ingredients">
          <h2>Ingredients</h2>
          <ul className="ingredient-list">
            {ingredients.map((item) => (
              <li key={item.id}>
                <span className="ingredient-list__measure">{item.measure}</span>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="recipe-detail__instructions">
          <h2>Instructions</h2>
          <ol>
            {instructions.map((step, index) => (
              <li key={`${meal.idMeal}-step-${index}`}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}

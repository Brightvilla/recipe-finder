import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function RecipeCard({ meal }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(meal.idMeal);

  return (
    <div className="recipe-card">
      <Link to={`/recipe/${meal.idMeal}`} className="recipe-card__link">
        <div className="recipe-card__image-wrap">
          <img
            src={`${meal.strMealThumb}/preview`}
            alt={meal.strMeal}
            className="recipe-card__image"
            loading="lazy"
          />
        </div>
        <div className="recipe-card__body">
          <h3 className="recipe-card__title">{meal.strMeal}</h3>
          <p className="recipe-card__meta">
            {meal.strCategory || meal.strArea
              ? [meal.strCategory, meal.strArea].filter(Boolean).join(" · ")
              : "Recipe"}
          </p>
        </div>
      </Link>
      <button
        type="button"
        className={
          saved
            ? "recipe-card__save recipe-card__save--active"
            : "recipe-card__save"
        }
        onClick={() => toggleFavorite(meal)}
        aria-pressed={saved}
        aria-label={saved ? "Remove from saved recipes" : "Save recipe"}
      >
        {saved ? "★ Saved" : "☆ Save"}
      </button>
    </div>
  );
}

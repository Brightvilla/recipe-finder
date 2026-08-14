import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <section className="page">
      <div className="page__intro">
        <p className="page__eyebrow">Your Recipe</p>
        <h1 className="page__heading">Saved recipes</h1>
        <p className="page__subheading">
          Everything you pin from a search lands here, stored right in this
          browser so it's ready next time you open the app.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="status-block">
          <p className="status-block__title">Your ledger is empty</p>
          <p>
            Save a recipe from the search page and it will show up here.{" "}
            <Link to="/" className="status-block__retry">
              Go find one
            </Link>
          </p>
        </div>
      ) : (
        <div className="recipe-grid">
          {favorites.map((meal) => (
            <RecipeCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </section>
  );
}

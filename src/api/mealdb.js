// TheMealDB — free public API, no signup or key required.
// Docs: https://www.themealdb.com/api.php
// "1" is the public test API key provided by TheMealDB for exactly this kind of use.
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

export async function searchMealsByName(query) {
  const response = await fetch(
    `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
  );
  const data = await handleResponse(response);
  return data.meals || [];
}

export async function getMealById(id) {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await handleResponse(response);
  return data.meals ? data.meals[0] : null;
}

export async function getRandomMeal() {
  const response = await fetch(`${BASE_URL}/random.php`);
  const data = await handleResponse(response);
  return data.meals ? data.meals[0] : null;
}

export async function getMealsByCategory(category) {
  const response = await fetch(
    `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
  );
  const data = await handleResponse(response);
  return data.meals || [];
}

export async function getCategories() {
  const response = await fetch(`${BASE_URL}/categories.php`);
  const data = await handleResponse(response);
  return data.categories || [];
}

// TheMealDB stores each ingredient/measure pair in numbered fields
// (strIngredient1..20 / strMeasure1..20) instead of an array. This
// flattens that into a clean, usable list.
export function extractIngredients(meal) {
  if (!meal) return [];
  const ingredients = [];
  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        id: `${meal.idMeal}-${i}`,
        name: ingredient.trim(),
        measure: measure ? measure.trim() : "",
      });
    }
  }
  return ingredients;
}

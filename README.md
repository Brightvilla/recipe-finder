# The Recipe Ledger

A React application for discovering recipes and building a personal, saved
collection of favorites — built as Phase 1 of a three-phase capstone project.

**Live demo:** _add your deployed URL here after deploying (optional)_

## What it does

The Recipe Box solves a simple problem: "I don't know what to cook, and I
don't want to lose track of the recipes I like." Users can search a large,
free recipe database by name, browse results as recipe cards, open a full
recipe (ingredients + step-by-step instructions), and save recipes to a
personal box that persists between visits.

## Features

- Dynamic search against [TheMealDB](https://www.themealdb.com/api.php), a
  free, public API that requires no signup or API key
- Loading, empty, and error states for every network request, with retry
- Three main views: **Search** (`/`), **Recipe Detail** (`/recipe/:id`), and
  **Saved Recipes** (`/favorites`)
- Client-side routing with React Router
- Favorites persisted to `localStorage` via a custom `FavoritesContext`, so
  saved recipes survive a page refresh
- A distinct visual identity ("recipe index card" look) built with plain CSS
  — no UI framework dependency

## Tech stack

- React 19 + Vite
- React Router (`react-router-dom`)
- Plain CSS with a small design-token system (see `src/index.css`)
- [TheMealDB API](https://www.themealdb.com/api.php)

## Project structure

```
src/
  api/mealdb.js          # all fetch calls to TheMealDB, isolated from UI
  context/FavoritesContext.jsx  # global favorites state + localStorage sync
  components/            # reusable UI: Navbar, SearchBar, RecipeCard, Loading, ErrorMessage
  pages/                 # route-level views: Home, RecipeDetail, Favorites
  App.jsx                # routes
  main.jsx               # app entry point, router + StrictMode
```

## Setup instructions

1. Clone the repository and move into it:
   ```bash
   git clone <your-repo-url>
   cd recipe-finder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the printed local URL (usually `http://localhost:5173`).

No environment variables or API keys are required — TheMealDB's public test
key (`1`) is baked into `src/api/mealdb.js` and is intended for exactly this
kind of use.

### Build for production

```bash
npm run build
npm run preview   # serve the production build locally
```

## API used

- **Base URL:** `https://www.themealdb.com/api/json/v1/1`
- `GET /search.php?s={query}` — search recipes by name
- `GET /lookup.php?i={id}` — full recipe details by ID
- `GET /random.php` — a random recipe (used to seed the homepage)

## Known limitations / challenges

- TheMealDB doesn't support pagination or "search by ingredient" on the free
  tier, so results are limited to whatever the name search returns.
- Favorites are stored per-browser (`localStorage`), not per-user — this is
  intentional for Phase 1. Phase 3 will replace this with real user accounts
  and server-side persistence.
- Some recipe entries in the API have incomplete data (missing instructions
  or thumbnails); the UI degrades gracefully but doesn't backfill missing
  fields.

## Roadmap (Phases 2 & 3)

- **Phase 2:** Replace direct API calls with a Flask backend that proxies
  and caches TheMealDB, and adds a database for storing recipes server-side.
- **Phase 3:** Add user authentication so favorites are tied to a real
  account instead of a single browser's local storage.

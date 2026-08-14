import { useState } from "react";

export default function SearchBar({ onSearch, initialValue = "" }) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Search recipes — try “chicken” or “pasta”"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="Search recipes"
      />
      <button type="submit" className="search-bar__button">
        Find recipes
      </button>
    </form>
  );
}

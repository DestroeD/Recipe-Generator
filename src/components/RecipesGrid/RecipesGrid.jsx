import { Link } from "react-router-dom";

import searchIcon from '../../assets/icons/search.svg';
import './RecipesGrid.css';
import RecipeCard from '../RecipeCard/RecipeCard';
import { useState, useMemo, useEffect } from 'react';

import { getAllRecipes } from "../../services/recipesService";

export default function RecipesGrid() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const list = await getAllRecipes();
        if (!cancelled) {
          setRecipes(list);
        }
      } catch (e) {
        console.error("Failed to load recipes", e);
        if (!cancelled) {
          setError("Не вдалося завантажити рецепти.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);
  
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return recipes;
    return recipes.filter(r => r.name.toLowerCase().includes(q));
  }, [recipes, search]);
  
  return (
    <div className="recipes-container">
      <div className="search-bar">
        <img src={searchIcon} alt="search" className="icon" />
        <input
          type="text"
          placeholder="Назва страви..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="search-info">
        {search ? (
          <>
            <span className="search-label">Результати пошуку: </span>
            <span className="search-query">"{search}"</span>
            <span className="search-count"> ({filtered.length})</span>
          </>
        ) : (
          <span className="search-label">Усі рецепти ({filtered.length})</span>
        )}
      </div>

      {loading && (
        <p className="recipes-loading">Завантаження рецептів…</p>
      )}

      {error && !loading && (
        <p className="recipes-error">{error}</p>
      )}

      {!loading && !error && (
        <div className="recipes-grid">
          {filtered.map((r) => (
            <Link
              key={r.slug}
              to={`/recipe/${r.slug}`}
              className="card-link"
              aria-label={r.name}
            >
              <RecipeCard recipe={r} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
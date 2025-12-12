import { Link } from "react-router-dom";

import searchIcon from '../../assets/icons/search.svg';
import './RecipesGrid.css';
import RecipeCard from '../RecipeCard/RecipeCard';
import { useState, useMemo } from 'react';

export default function RecipesGrid({ recipes = [] }) {
  const [search, setSearch] = useState('');

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

      <div className="recipes-grid">
        {filtered.map((r) => (
          <Link key={r.slug} to={`/recipe/${r.slug}`} className="card-link" aria-label={r.name}>
            <RecipeCard recipe={r} />
          </Link>
        ))}
      </div>
    </div>
  );
}

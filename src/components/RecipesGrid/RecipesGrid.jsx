import searchIcon from '../../assets/icons/search.svg';
import './RecipesGrid.css';
import RecipeCard from '../RecipeCard/RecipeCard';
import { useState } from 'react';

import recipe1 from '../../assets/images/recipes/recipe1.jpg';
import recipe2 from '../../assets/images/recipes/recipe2.jpg';
import recipe3 from '../../assets/images/recipes/recipe3.jpg';
import recipe4 from '../../assets/images/recipes/recipe4.jpg';
import recipe5 from '../../assets/images/recipes/recipe5.jpg';
import recipe6 from '../../assets/images/recipes/recipe6.jpeg';

const recipes = [
  { name: 'Курячий плов', time: '40 хвилин', rating: 4, portions: 4, image: recipe1 },
  { name: 'Паста Карбонара', time: '25 хвилин', rating: 5, portions: 2, image: recipe2 },
  { name: 'Лазанья болоньєзе', time: '60 хвилин', rating: 5, portions: 4, image: recipe3 },
  { name: 'Крем-суп із гарбуза', time: '40 хвилин', rating: 3, portions: 3, image: recipe4 },
  { name: 'Омлет з овочами', time: '15 хвилин', rating: 5, portions: 2, image: recipe5 },
  { name: 'Картопля по-селянськи', time: '30 хвилин', rating: 4, portions: 2, image: recipe6 },
];

export default function RecipesGrid() {
  const [search, setSearch] = useState('');

  const filtered = recipes.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

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
        {filtered.map((r, i) => (
          <RecipeCard key={i} recipe={r} />
        ))}
      </div>
    </div>
  );
}

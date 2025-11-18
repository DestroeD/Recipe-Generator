import { useState } from 'react';
import './HomePage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import FilterBar from '../../components/FilterBar/FilterBar';
import RecipesGrid from '../../components/RecipesGrid/RecipesGrid';
import { recipes as ALL_RECIPES } from '../../data/recipes';

export default function HomePage() {
  const [result, setResult] = useState({
    items: ALL_RECIPES,
    total: ALL_RECIPES.length,
  });

  return (
    <div className="homepage">
      <div className="homepage-container">
        <Sidebar />
        <main className="recipes-section">
          <RecipesGrid recipes={result.items} />
        </main>
        <FilterBar onResults={setResult} />
      </div>
    </div>
  );
}

import { useState } from 'react';
import './HomePage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import FilterBar from '../../components/FilterBar/FilterBar';
import RecipesGrid from '../../components/RecipesGrid/RecipesGrid';

export default function HomePage() {
  const [filteredByFilters, setFilteredByFilters] = useState(null);

  return (
    <div className="homepage">
      <div className="homepage-container">
        <Sidebar />
        <main className="recipes-section">
          <RecipesGrid externalRecipes={filteredByFilters} />
        </main>
        <FilterBar onResults={setFilteredByFilters} />
      </div>
    </div>
  );
}

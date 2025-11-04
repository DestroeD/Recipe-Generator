import './HomePage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import FilterBar from '../../components/FilterBar/FilterBar';
import RecipesGrid from '../../components/RecipesGrid/RecipesGrid';

export default function HomePage() {
  return (
    <div className="homepage">
      <div className="homepage-container">
        <Sidebar />
        <main className="recipes-section">
          <RecipesGrid />
        </main>
        <FilterBar />
      </div>
    </div>
  );
}

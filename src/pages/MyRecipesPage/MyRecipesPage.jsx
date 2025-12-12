import { Link, useNavigate } from 'react-router-dom';
import { recipes } from "../../data/recipes";
import './MyRecipesPage.css';

import AuthSwitch from '../../components/AuthSwitch/AuthSwitch';
import Sidebar from '../../components/Sidebar/Sidebar';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import searchIcon from '../../assets/icons/search.svg';
import profileIcon from '../../assets/icons/user-icon.svg';

const savedSlugs = ["pasta-carbonara", "veggie-omelette", "pumpkin-cream-soup", "lasagna-bolognese"];

const savedRecipes = savedSlugs
  .map(slug => recipes.find(r => r.slug === slug))
  .filter(Boolean);

export default function MyRecipesPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/", { replace: true });
  };

  return (
    <div className="savedpage">
      <div className="savedpage-container">
        <Sidebar />

        <main className="saved-section">
          <div className="top-buttons">
            <div className="left-side">
              <button
                className="back-btn"
                type="button"
                onClick={handleBack}
                aria-label="Повернутися на попередню сторінку"
                title="Назад"
              >
                ←
              </button>
              <h2>Мої рецепти ({savedRecipes.length})</h2>
            </div>

            <div className="right-buttons">
              <AuthSwitch />
              <Link to="/create" className="create-btn">+ Створити рецепт</Link>
            </div>
          </div>

          <div className="search-input">
            <img src={searchIcon} alt="search" />
            <input type="text" placeholder="Пошук ваших рецептів..." />
          </div>

          <div className="saved-grid">
            {savedRecipes.map((r) => (
              <Link key={r.slug} to={`/recipe/${r.slug}`} className="card-link" aria-label={r.name}>
                <RecipeCard recipe={{ ...r, saved: true }} />
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

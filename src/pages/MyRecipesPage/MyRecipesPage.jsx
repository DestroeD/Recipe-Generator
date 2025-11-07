import { Link, useNavigate } from 'react-router-dom';
import './MyRecipesPage.css';

import Sidebar from '../../components/Sidebar/Sidebar';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import searchIcon from '../../assets/icons/search.svg';
import profileIcon from '../../assets/icons/user-icon.svg';

import recipe2 from '../../assets/images/recipes/recipe2.jpg';
import recipe3 from '../../assets/images/recipes/recipe3.jpg';
import recipe4 from '../../assets/images/recipes/recipe4.jpg';
import recipe5 from '../../assets/images/recipes/recipe5.jpg';

const savedRecipes = [
  { name: 'Паста Карбонара', time: '25 хвилин', rating: 5, portions: 2, image: recipe2 },
  { name: 'Омлет з овочами', time: '15 хвилин', rating: 5, portions: 2, image: recipe5 },
  { name: 'Крем-суп із гарбуза', time: '40 хвилин', rating: 5, portions: 3, image: recipe4 },
  { name: 'Лазанья болоньєзе', time: '60 хвилин', rating: 5, portions: 4, image: recipe3 },
];

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
              <Link to="/profile" className="profile-link" aria-label="Профіль">
                <img src={profileIcon} alt="profile" className="profile-icon" />
              </Link>
              <Link to="/create" className="create-btn">+ Створити рецепт</Link>
            </div>
          </div>

          <div className="search-input">
            <img src={searchIcon} alt="search" />
            <input type="text" placeholder="Пошук ваших рецептів..." />
          </div>

          <div className="saved-grid">
            {savedRecipes.map((r, i) => (
              <RecipeCard key={i} recipe={{ ...r, saved: true }} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

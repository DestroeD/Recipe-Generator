import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { recipes } from "../../data/recipes";
import './SavedPage.css';

import AuthSwitch from '../../components/AuthSwitch/AuthSwitch';
import Sidebar from '../../components/Sidebar/Sidebar';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import searchIcon from '../../assets/icons/search.svg';

import { useSaved } from "../../context/SavedContext.jsx";

export default function SavedPage() {
  const navigate = useNavigate();

  const { isSaved } = useSaved();

  const savedRecipes = useMemo(
    () => recipes.filter((r) => isSaved(r.id)),
    [isSaved]
  );

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
              <h2>Збережені ({savedRecipes.length})</h2>
            </div>

            <div className="right-buttons">
              <AuthSwitch />
              <Link to="/create" className="create-btn">+ Створити рецепт</Link>
            </div>
          </div>

          <div className="search-input">
            <img src={searchIcon} alt="search" />
            <input type="text" placeholder="Пошук у вашій колекції..." />
          </div>

          <div className="saved-grid">
            {savedRecipes.map((r) => (
              <Link
                key={r.slug}
                to={`/recipe/${r.slug}`}
                className="card-link"
                aria-label={r.name}
              >
                <RecipeCard recipe={{ ...r, saved: true }} />
              </Link>
            ))}

            {savedRecipes.length === 0 && (
              <p style={{ color: "#596069", marginTop: 8 }}>
                Немає збережених рецептів.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

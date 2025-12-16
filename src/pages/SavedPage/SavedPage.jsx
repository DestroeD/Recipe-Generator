import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
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

  const [search, setSearch] = useState("");

  const savedRecipes = useMemo(
    () => recipes.filter((r) => isSaved(r.id)),
    [isSaved]
  );

  const filteredSaved = useMemo(
    () => {
      const q = search.toLowerCase().trim();
      if (!q) return savedRecipes;

      return savedRecipes.filter((r) =>
        r.name.toLowerCase().includes(q)
      );
    },
    [savedRecipes, search]
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
              <h2>Збережені</h2>
            </div>

            <div className="right-buttons">
              <AuthSwitch />
              <Link to="/create" className="create-btn">+ Створити рецепт</Link>
            </div>
          </div>

          <div className="search-input">
            <img src={searchIcon} alt="search" />
            <input
              type="text"
              placeholder="Пошук у вашій колекції..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="search-info">
            {search ? (
              <>
                <span className="search-label">Результати в збережених: </span>
                <span className="search-query">"{search}"</span>
                <span className="search-count"> ({filteredSaved.length})</span>
              </>
            ) : (
              <span className="search-label">
                Усі збережені ({savedRecipes.length})
              </span>
            )}
          </div>

          <div className="saved-grid">
            {savedRecipes.length === 0 && (
              <p style={{ color: "#596069", marginTop: 8 }}>
                Немає збережених рецептів.
              </p>
            )}

            {savedRecipes.length > 0 && filteredSaved.length === 0 && (
              <p style={{ color: "#596069", marginTop: 8 }}>
                За запитом "{search}" рецептів не знайдено.
              </p>
            )}

            {filteredSaved.map((r) => (
              <Link
                key={r.slug}
                to={`/recipe/${r.slug}`}
                className="card-link"
                aria-label={r.name}
              >
                <RecipeCard recipe={{ ...r, saved: true }} />
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

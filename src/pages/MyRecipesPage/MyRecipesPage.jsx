import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './MyRecipesPage.css';

import AuthSwitch from '../../components/AuthSwitch/AuthSwitch';
import Sidebar from '../../components/Sidebar/Sidebar';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import searchIcon from '../../assets/icons/search.svg';

import { useAuth } from "../../context/AuthContext.jsx";

import { getAllRecipes } from "../../services/recipesService";

export default function MyRecipesPage() {
  const navigate = useNavigate();
  const { user, isAuthed } = useAuth();

  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!isAuthed || !user) {
      setMyRecipes([]);
      setLoading(false);
      setError("");
      return;
    }

    async function load() {
      try {
        setLoading(true);
        setError("");
        const all = await getAllRecipes();
        const mine = all.filter((r) => r.authorId === user.id);
        if (!cancelled) {
          setMyRecipes(mine);
        }
      } catch (e) {
        console.error("Failed to load my recipes", e);
        if (!cancelled) {
          setError("Не вдалося завантажити ваші рецепти.");
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
  }, [isAuthed, user?.id]);

  // пошук по назві серед моїх рецептів
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return myRecipes;
    return myRecipes.filter((r) => r.name.toLowerCase().includes(q));
  }, [myRecipes, search]);

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
              <h2>Мої рецепти ({myRecipes.length})</h2>
            </div>

            <div className="right-buttons">
              <AuthSwitch />
              <Link to="/create" className="create-btn">+ Створити рецепт</Link>
            </div>
          </div>

          {!isAuthed && (
            <p className="myrecipes-info">
              Увійдіть у акаунт, щоб переглянути свої рецепти.
            </p>
          )}

          {isAuthed && (
            <>
              <div className="search-input">
                <img src={searchIcon} alt="search" />
                <input
                  type="text"
                  placeholder="Пошук ваших рецептів..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {loading && (
                <p className="myrecipes-loading">Завантаження ваших рецептів…</p>
              )}

              {error && !loading && (
                <p className="myrecipes-error">{error}</p>
              )}

              {!loading && !error && (
                <div className="saved-grid">
                  {filtered.length === 0 ? (
                    <p className="myrecipes-empty">
                      У вас поки немає власних рецептів.
                    </p>
                  ) : (
                    filtered.map((r) => (
                      <Link
                        key={r.slug}
                        to={`/recipe/${r.slug}`}
                        className="card-link"
                        aria-label={r.name}
                      >
                        <RecipeCard recipe={r} />
                      </Link>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
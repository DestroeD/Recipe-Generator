import './RecipePage.css';
import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";

import Sidebar from '../../components/Sidebar/Sidebar';

import clockIcon from '../../assets/icons/clock.svg';
import bookmarkIcon from '../../assets/icons/bookmark.svg';
import profileIcon from '../../assets/icons/user-icon.svg';
import star from '../../assets/icons/star.svg';
import starFilled from '../../assets/icons/star-filled.svg';

import { recipes } from "../../data/recipes";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSaved } from "../../context/SavedContext.jsx";
import AuthSwitch from '../../components/AuthSwitch/AuthSwitch.jsx';

export default function RecipePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthed } = useAuth();
  const { isSaved, toggleSaved } = useSaved();

  const onSaveClick = (e) => {
    e.preventDefault();
    if (!isAuthed) {
      navigate("/login", { state: { from: location }, replace: false });
      return;
    }
    try {
      toggleSaved(recipe.id);
    } catch {
      navigate("/login", { state: { from: location }, replace: false });
    }
  };

  const recipe = useMemo(
    () => recipes.find((r) => r.slug === slug),
    [slug]
  );

  const savedNow = recipe ? isSaved(recipe.id) : false;

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/", { replace: true });
  };

  function formatPortions(n) {
  const abs = Math.abs(n);
  const last = abs % 10;
  const lastTwo = abs % 100;

  if (last === 1 && lastTwo !== 11) return `${n} порція`;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${n} порції`;
  return `${n} порцій`;
}

  const rounded = Math.round(recipe.rating ?? 0);

  return (
    <div className="recipepage">
      <div className="recipepage-container">
        <Sidebar />

        <main className="recipe-content-area">
          <div className="recipe-topbar">
            <button
                className="back-btn"
                type="button"
                onClick={handleBack}
                aria-label="Повернутися на попередню сторінку"
                title="Назад"
              >
                ←
              </button>

            <div className="right-actions">
              <AuthSwitch />
              <button className="create-btn2">+ Створити рецепт</button>
            </div>
          </div>

          <div className="header-grid">
            <figure className="photo-wrap">
              <img src={recipe.image} alt={recipe.name} />
            </figure>

            <div className="info-wrap">
              <h1 className="title">{recipe.name}</h1>

              <div className="author-row">
                <img src={profileIcon} alt="Аватар" className="avatar" />
                <div className="author-meta">
                  <div className="nickname">{recipe.author}</div>
                  <p className="desc">{recipe.description}</p>
                </div>
              </div>

              <div className="rating">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={i <= rounded ? starFilled : star}
                    alt={`Зірка ${i}`}
                    className="star"
                    onClick={() => setRating(i)}
                  />
                ))}
              </div>

              <div className="save-row">
                <button
                  type="button"
                  className={`save-button ${savedNow ? "saved" : ""}`}
                  onClick={onSaveClick}
                >
                  <img src={bookmarkIcon} alt="" aria-hidden="true" />
                  {savedNow ? "Збережено" : "Зберегти рецепт"}
                </button>
              </div>
            </div>
          </div>

          <div className="content-grid">
            <section className="block ingredients">
              <h2>Інгредієнти:</h2>

              <div className="inline-meta">
                <img src={profileIcon} alt="" aria-hidden="true" />
                <span>{formatPortions(recipe.portions)}</span>
              </div>

              <ul className="ing-list">
                {recipe.ingredients.map((text, i) => (
                  <li key={i} className="ing-item">{text}</li>
                ))}
              </ul>
            </section>

            <section className="block steps">
              <div className="steps-header">
                <h2>Інструкція з приготування</h2>
                <div className="time">
                  <img src={clockIcon} alt="" aria-hidden="true" />
                  <span>{recipe.time}</span>
                </div>
              </div>

              <ol className="steps-list">
                {recipe.steps.map((text, i) => (
                  <li key={i} className="step">
                    <span className="num">{i + 1}</span>
                    <p>{text}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

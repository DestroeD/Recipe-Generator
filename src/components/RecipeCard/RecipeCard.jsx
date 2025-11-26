import { useNavigate, useLocation } from "react-router-dom";

import './RecipeCard.css';
import { useState } from 'react';
import clockIcon from '../../assets/icons/clock.svg';
import starIcon from '../../assets/icons/star.svg';
import starFilledIcon from '../../assets/icons/star-filled.svg';

import { useAuth } from "../../context/AuthContext.jsx";
import { useSaved } from "../../context/SavedContext.jsx";

export default function RecipeCard({ recipe }) {
  const nav = useNavigate();
  const location = useLocation();
  const { isAuthed } = useAuth();
  const { isSaved, toggleSaved } = useSaved();
  const savedNow = isSaved(recipe.id);

  const onSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthed) {
      nav("/login", { replace: false, state: { from: location } });
      return;
    }
    try {
      await toggleSaved(recipe.id);
    } catch (err) {
      console.error("Failed to toggle saved recipe", err);

      if (err?.message === "AUTH_REQUIRED") {
        nav("/login", { replace: false, state: { from: location } });
      }
    }
  };
  
  const [rating, setRating] = useState(recipe.rating);

  const setStar = (e, i) => {
    e.preventDefault();
    e.stopPropagation();
    setRating(i);
  };

  function formatPortions(n) {
  const abs = Math.abs(n);
  const last = abs % 10;
  const lastTwo = abs % 100;

  if (last === 1 && lastTwo !== 11) return `${n} порція`;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${n} порції`;
  return `${n} порцій`;
  }

  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.name} className="recipe-img" />

      <div className="recipe-info">
        <h3>{recipe.name}</h3>

        <p className="meta">
          <img src={clockIcon} alt="clock" className="icon" />
          {recipe.time}
        </p>

        <div className="rating-row">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                src={i <= rating ? starFilledIcon : starIcon}
                alt="rating"
                onClick={(e) => setStar(e, i)}
              />
            ))}
          </div>
          <p className="portions">{formatPortions(recipe.portions)}</p>
        </div>

        <button
          type="button"
          className={`save-btn ${savedNow ? "saved" : ""}`}
          onClick={onSaveClick}
        >
          {savedNow ? "Збережено" : "Зберегти рецепт"}
        </button>
      </div>
    </div>
  );
}

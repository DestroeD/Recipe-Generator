import './RecipeCard.css';
import { useState } from 'react';
import clockIcon from '../../assets/icons/clock.svg';
import starIcon from '../../assets/icons/star.svg';
import starFilledIcon from '../../assets/icons/star-filled.svg';
import bookmarkIcon from '../../assets/icons/bookmark.svg';

export default function RecipeCard({ recipe }) {
  const [rating, setRating] = useState(recipe.rating);
  const [saved, setSaved] = useState(recipe.saved || false);

  const toggleSave = () => {
    setSaved(!saved);
  };

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
                onClick={() => setRating(i)}
              />
            ))}
          </div>
          <p className="portions">{recipe.portions} порції</p>
        </div>

        <button className={`save-btn ${saved ? 'saved' : ''}`} onClick={toggleSave}>
          {saved ? 'Збережено' : 'Зберегти рецепт'}
        </button>
      </div>
    </div>
  );
}

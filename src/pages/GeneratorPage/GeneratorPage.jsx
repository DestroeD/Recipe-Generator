import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./GeneratorPage.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import clockIcon from "../../assets/icons/clock.svg";
import starIcon from "../../assets/icons/star.svg";
import starFilledIcon from "../../assets/icons/star-filled.svg";

import fallbackImg from "../../assets/images/recipes/recipe1.jpg";
import AuthSwitch from "../../components/AuthSwitch/AuthSwitch";

import { getRandomRecipe } from "../../services/recipesService";

export default function GeneratorPage() {
  const [recipe, setRecipe] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/", { replace: true });
  };

  // натиснули "Розпочати генерацію"
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");

      const randomRecipe = await getRandomRecipe();

      if (!randomRecipe) {
        setRecipe(null);
        setRating(0);
        setError("Поки немає жодного рецепта для генерації.");
        return;
      }

      setRecipe(randomRecipe);
      setRating(randomRecipe.rating ?? 0);
    } catch (err) {
      console.error(err);
      setError("Сталася помилка під час генерації страви.");
    } finally {
      setLoading(false);
    }
  };

  const openRecipe = () => {
    if (!recipe) return;
    if (recipe.slug) {
      navigate(`/recipe/${recipe.slug}`);
    }
  };

  const onKeyOpen = (e) => {
    if (!recipe) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openRecipe();
    }
  };

  // значення для відмалювання (якщо рецепт ще не згенерований)
  const title = recipe?.name || "Натисніть “Розпочати генерацію”";
  const description =
    recipe?.shortDescription ||
    recipe?.description ||
    "Ми підберемо для вас випадковий рецепт з усіх доступних у базі.";
  const time = recipe?.time || "—";
  const portions = recipe?.servings || recipe?.portions || "—";
  const imageSrc = recipe?.image || fallbackImg;

  return (
    <div className="generatorpage">
      <div className="generatorpage-container">
        <Sidebar />

        <main className="generator-section">
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
              <h2>Генератор страв</h2>
            </div>

            <div className="right-buttons">
              <AuthSwitch />
              <Link to="/create" className="create-btn">
                + Створити рецепт
              </Link>
            </div>
          </div>

          {error && <p className="generator-error">{error}</p>}

          <section
            className={`featured-card ${
              recipe ? "is-clickable" : "is-disabled"
            }`}
            role={recipe ? "link" : "group"}
            tabIndex={recipe ? 0 : -1}
            aria-label={
              recipe
                ? `Відкрити рецепт: ${title}`
                : "Спочатку згенеруйте рецепт"
            }
            onClick={recipe ? openRecipe : undefined}
            onKeyDown={recipe ? onKeyOpen : undefined}
          >
            <div className="featured-left">
              <img src={imageSrc} alt={title} />
            </div>

            <div className="featured-right">
              <h3 className="featured-title">{title}</h3>
              <p className="featured-desc">{description}</p>

              <div className="meta-row">
                <span className="meta-time">
                  <img src={clockIcon} alt="" /> {time}
                </span>

                <div className="rating-line">
                  <div className="meta-stars">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        className="star-btn"
                        aria-label={`Оцінити на ${i} з 5`}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          setRating(i);
                        }}
                      >
                        <img
                          src={i <= rating ? starFilledIcon : starIcon}
                          alt=""
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>

                  <span className="meta-portions">
                    {portions} {portions === "—" ? "" : "порції"}
                  </span>
                </div>
              </div>

              <button
                className="save-outline"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                disabled={!recipe}
              >
                <span className="bookmark-ico" aria-hidden="true"></span>
                Зберегти рецепт
              </button>
            </div>
          </section>

          <div className="cta-wrap">
            <button
              className="start-cta"
              onClick={handleGenerate}
              disabled={loading}
            >
              <span className="start-ico" aria-hidden="true"></span>
              {loading ? "Генеруємо..." : "Розпочати генерацію"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

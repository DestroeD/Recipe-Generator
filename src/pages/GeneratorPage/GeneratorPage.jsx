import { Link, useNavigate } from "react-router-dom";
import "./GeneratorPage.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import profileIcon from "../../assets/icons/user-icon.svg";
import clockIcon from "../../assets/icons/clock.svg";
import starIcon from "../../assets/icons/star.svg";
import starFilledIcon from "../../assets/icons/star-filled.svg";

import recipeImg from "../../assets/images/recipes/recipe1.jpg";

import { useState } from "react";

export default function GeneratorPage() {
  const [rating, setRating] = useState(4);
  const portions = 2;

  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/", { replace: true });
  };

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
              <Link to="/profile" className="profile-link" aria-label="Профіль">
                <img src={profileIcon} alt="profile" className="profile-icon" />
              </Link>
              <Link to="/create" className="create-btn">+ Створити рецепт</Link>
            </div>
          </div>

          <section
            className="featured-card is-clickable"
            role="button"
            tabIndex={0}
            aria-label="Відкрити рецепт: Курячий плов"
          >
            <div className="featured-left">
              <img src={recipeImg} alt="Курячий плов" />
            </div>

            <div className="featured-right">
              <h3 className="featured-title">Курячий плов</h3>
              <p className="featured-desc">
                Приготувавши плов саме за таким рецептом, рис сто відсотків вийде у вас
                розсипчастим
              </p>

              <div className="meta-row">
                <span className="meta-time">
                  <img src={clockIcon} alt="" /> 25 хвилин
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

                  <span className="meta-portions">{portions} порції</span>
                </div>
              </div>

              <button
                className="save-outline"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <span className="bookmark-ico" aria-hidden="true"></span>
                Зберегти рецепт
              </button>
            </div>
          </section>

          <div className="cta-wrap">
            <button className="start-cta">
              <span className="start-ico" aria-hidden="true"></span>
              Розпочати генерацію
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

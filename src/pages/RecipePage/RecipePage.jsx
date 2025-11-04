import './RecipePage.css';
import { useState } from 'react';

import Sidebar from '../../components/Sidebar/Sidebar';

import clockIcon from '../../assets/icons/clock.svg';
import bookmarkIcon from '../../assets/icons/bookmark.svg';
import profileIcon from '../../assets/icons/user-icon.svg';
import star from '../../assets/icons/star.svg';
import starFilled from '../../assets/icons/star-filled.svg';

import recipeImg from '../../assets/images/recipes/recipe6.jpeg';

export default function RecipePage() {
  const [rating, setRating] = useState(4.3);

  const recipe = {
    title: 'Картопля по-селянськи',
    author: 'Nickname',
    description: 'Молода картопля по-селянськи в рукаві – що може бути краще? 🤤',
    time: '30 хв',
    servings: '6–8 порцій',

    steps: [
      'Для початку гарно помити картоплю 🥔.',
      'Потім нарізати дольками картоплю та перекладаємо в миску та ще раз промиваємо.',
      'Далі беремо сіль 🧂, перець мелений, приправу до картоплі та соняшникову 🌻 олію та додаємо в миску до картоплі та все ретельно перемішуємо.',
      'Далі беремо деко та кладемо на нього фольгу та перекладаємо картоплю. Потім кладемо деко в духовку та випікаємо 180–200 градусів, 25–45 хвилин. Смачного!✨💜',
    ],
    ingredients: [
      '1,5 кг молодої дрібної картоплі',
      '200–300 г бекону',
      '1 велика цибуля',
      'До смаку спеції (сіль, перець, копчена паприка, розмарин, чебрець, куркума)',
      '1 ст. л. олії',
      'Жменя кропу, щоб прикрасити',
    ],
  };

  return (
    <div className="recipepage">
      <div className="recipepage-container">
        <Sidebar />

        <main className="recipe-content-area">
          <div className="recipe-topbar">
            <button className="back-btn" aria-label="Назад">
              ←
            </button>

            <div className="right-actions">
              <button className="ghost-btn">Вхід</button>
              <button className="create-btn2">+ Створити рецепт</button>
            </div>
          </div>

          <div className="header-grid">
            <figure className="photo-wrap">
              <img src={recipeImg} alt={recipe.title} />
            </figure>

            <div className="info-wrap">
              <h1 className="title">{recipe.title}</h1>

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
                    src={i <= Math.round(rating) ? starFilled : star}
                    alt={`Зірка ${i}`}
                    className="star"
                    onClick={() => setRating(i)}
                  />
                ))}
              </div>

              <div className="save-row">
                <button className="save-button">
                  <img src={bookmarkIcon} alt="" aria-hidden="true" />
                  Зберегти рецепт
                </button>
              </div>
            </div>
          </div>

          <div className="content-grid">
            <section className="block ingredients">
              <h2>Інгредієнти:</h2>

              <div className="inline-meta">
                <img src={profileIcon} alt="" aria-hidden="true" />
                <span>{recipe.servings}</span>
              </div>

              <ul className="ing-list">
                {recipe.ingredients.map((text, i) => (
                  <li key={i} className="ing-item">
                    {text}
                  </li>
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

import { Link, useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

import searchIcon from "../../assets/icons/search.svg";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/", { replace: true });
  };

  return (
    <div className="nf-wrap">
      <div className="nf-blob nf-blob-a" aria-hidden="true" />
      <div className="nf-blob nf-blob-b" aria-hidden="true" />

      <main className="nf-card" role="main">
        <p className="nf-code">404</p>
        <h1 className="nf-title">Ой! Сторінку не знайдено</h1>
        <p className="nf-desc">
          Можливо, посилання застаріло або ви помилилися в адресі. Спробуйте повернутися або
          знайти потрібний рецепт нижче.
        </p>

        <div className="nf-actions">
          <button className="ghost-btn" onClick={goBack} type="button">← Назад</button>
          <Link className="create-btn2" to="/">На головну</Link>
          <Link className="ghost-btn" to="/create">+ Створити рецепт</Link>
        </div>

        <form className="nf-search" onSubmit={(e)=>e.preventDefault()}>
          <img src={searchIcon} alt="" aria-hidden="true" className="nf-search-icon" />
          <input placeholder="Спробуйте: «картопля», «паста», «суп»…" />
          <Link to="/" className="nf-search-btn">Пошук</Link>
        </form>

        <p className="nf-links">
          Або відкрийте <Link to="/saved" className="nf-link">збережені рецепти</Link> чи
          <Link to="/generator" className="nf-link"> згенеруйте страву</Link>.
        </p>
      </main>
    </div>
  );
}

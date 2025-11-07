import { Link } from "react-router-dom";
import './FilterBar.css';

export default function FilterBar() {
  return (
    <aside className="filter-bar">
      <div className="top-buttons">
        <Link to="/login" className="login-btn">Вхід</Link>
        <Link to="/create" className="create-btn">+ Створити рецепт</Link>
      </div>

      <hr className="divider" />

      <div className="filters">
        <div className="header">
          <h3>Фільтри</h3>
          <button className="reset">Скинути</button>
        </div>

        <div className="filter-group">
          <label>Показати рецепти з:</label>
          <input type="text" placeholder="Введіть інгредієнти..." />
        </div>

        <div className="filter-group">
          <label>Показати рецепти без:</label>
          <input type="text" placeholder="Введіть інгредієнти..." />
        </div>

        <hr className="divider" />

        <div className="filter-group-time">
          <h4>Тривалість приготування:</h4>
          <div className="time-filters">
            <label>
              <input type="checkbox" /> &lt;15 хв
            </label>
            <label>
              <input type="checkbox" /> 15–30 хв
            </label>
            <label>
              <input type="checkbox" /> 30–45 хв
            </label>
            <label>
              <input type="checkbox" /> &gt;45 хв
            </label>
          </div>
        </div>

        <hr className="divider" />

        <div className="filter-group vegetarian">
          <label>
            <input type="checkbox" /> Вегетаріанські страви
          </label>
        </div>
      </div>
    </aside>
  );
}

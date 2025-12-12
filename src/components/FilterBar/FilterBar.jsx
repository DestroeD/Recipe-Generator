import { Link } from "react-router-dom";
import "./FilterBar.css";
import AuthSwitch from "../AuthSwitch/AuthSwitch";

import { useEffect, useMemo, useRef, useState } from "react";
import { searchRecipes, suggestIngredients } from "../../services/searchService";

function useDebounced(value, ms = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function FilterBar({ onResults }) {
  // стан чіпів
  const [includeChips, setIncludeChips] = useState([]);
  const [excludeChips, setExcludeChips] = useState([]);

  // інпут-поле
  const [withText, setWithText] = useState("");
  const [withoutText, setWithoutText] = useState("");

  // режими/прапорці
  const [timeRanges, setTimeRanges] = useState([]);
  const [vegetarian, setVegetarian] = useState(false);

  // підказки
  const debWith = useDebounced(withText);
  const debWithout = useDebounced(withoutText);
  const [withSuggest, setWithSuggest] = useState([]);
  const [withoutSuggest, setWithoutSuggest] = useState([]);

  const withBoxRef = useRef(null);
  const withoutBoxRef = useRef(null);
  useEffect(() => {
    function handler(e) {
      if (withBoxRef.current && !withBoxRef.current.contains(e.target)) setWithSuggest([]);
      if (withoutBoxRef.current && !withoutBoxRef.current.contains(e.target)) setWithoutSuggest([]);
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    setWithSuggest(debWith ? suggestIngredients(debWith) : []);
  }, [debWith]);
  useEffect(() => {
    setWithoutSuggest(debWithout ? suggestIngredients(debWithout) : []);
  }, [debWithout]);

  // додавання чіпів тільки кліком по підказці
  const addInclude = (item) => {
    setIncludeChips((prev) => prev.some(x => x.id === item.id) ? prev : [...prev, item]);
    setWithText("");
    setWithSuggest([]);
  };
  const addExclude = (item) => {
    setExcludeChips((prev) => prev.some(x => x.id === item.id) ? prev : [...prev, item]);
    setWithoutText("");
    setWithoutSuggest([]);
  };

  // видалення чіпа
  const removeInclude = (id) => setIncludeChips(prev => prev.filter(x => x.id !== id));
  const removeExclude = (id) => setExcludeChips(prev => prev.filter(x => x.id !== id));

  // запит пошуку
  const query = useMemo(() => ({
  includeIds: includeChips.map(c => c.id),
  excludeIds: excludeChips.map(c => c.id),
  timeRanges,
  vegetarian
}), [includeChips, excludeChips, timeRanges, vegetarian]);

  // виклик пошуку
  useEffect(() => {
    const res = searchRecipes(query);
    onResults?.(res);
  }, [query, onResults]);

  const reset = () => {
  setIncludeChips([]); setExcludeChips([]);
  setWithText(""); setWithoutText("");
  setTimeRanges([]);
  setVegetarian(false);
};

  const toggleTimeRange = (value) => {
  setTimeRanges((prev) =>
    prev.includes(value)
      ? prev.filter(v => v !== value)
      : [...prev, value]
  );
};

  return (
    <aside className="filter-bar">
      <div className="top-buttons">
        <AuthSwitch />
        <Link to="/create" className="create-btn">+ Створити рецепт</Link>
      </div>

      <hr className="divider" />

      <div className="filters">
        <div className="header">
          <h3>Фільтри</h3>
          <button className="reset" onClick={reset}>Скинути</button>
        </div>

        <div className="filter-group">
          <label>Показати рецепти з:</label>

          <div className="chips-row">
            {includeChips.map(chip => (
              <span key={chip.id} className="chip">
                {chip.label}
                <button className="chip-x" onClick={() => removeInclude(chip.id)} aria-label="Видалити">×</button>
              </span>
            ))}
          </div>

          <div className="suggest-wrapper" ref={withBoxRef}>
            <input
              type="text"
              value={withText}
              onChange={(e) => setWithText(e.target.value)}
              placeholder={includeChips.length ? "Додати ще інгредієнт..." : "Введіть інгредієнт і оберіть..."}
              onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            />
            {withSuggest.length > 0 && (
              <ul className="suggest-list">
                {withSuggest.map(item => (
                  <li key={item.id} className="suggest-item" onClick={() => addInclude(item)}>
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="filter-group">
          <label>Показати рецепти без:</label>

          <div className="chips-row">
            {excludeChips.map(chip => (
              <span key={chip.id} className="chip chip--danger">
                {chip.label}
                <button className="chip-x" onClick={() => removeExclude(chip.id)} aria-label="Видалити">×</button>
              </span>
            ))}
          </div>

          <div className="suggest-wrapper" ref={withoutBoxRef}>
            <input
              type="text"
              value={withoutText}
              onChange={(e) => setWithoutText(e.target.value)}
              placeholder={excludeChips.length ? "Додати ще виключення..." : "Введіть інгредієнт і оберіть..."}
              onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            />
            {withoutSuggest.length > 0 && (
              <ul className="suggest-list">
                {withoutSuggest.map(item => (
                  <li key={item.id} className="suggest-item" onClick={() => addExclude(item)}>
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <hr className="divider" />

        <div className="filter-group-time">
          <h4>Тривалість приготування:</h4>
          <div className="time-filters">
            {["<15","15-30","30-45",">45"].map(t => (
              <label key={t}>
                <input
                  type="checkbox"
                  checked={timeRanges.includes(t)}
                  onChange={() => toggleTimeRange(t)}
                /> {t} хв
              </label>
            ))}
          </div>
        </div>

        <hr className="divider" />

        <div className="filter-group vegetarian">
          <label>
            <input type="checkbox" checked={vegetarian} onChange={e => setVegetarian(e.target.checked)} />
            Вегетаріанські страви
          </label>
        </div>
      </div>
    </aside>
  );
}

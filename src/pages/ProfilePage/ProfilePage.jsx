import { Link, useNavigate } from "react-router-dom";
import './ProfilePage.css';
import userIcon from '../../assets/icons/user-icon.svg';

import { useAuth } from "../../context/AuthContext.jsx";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const onLogout = () => {
    nav("/", { replace: true });
    logout();
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">Профіль</h1>

      <div className="profile-card">
        <Link to="/" className="close-btn" aria-label="Закрити та повернутись на головну">
          ×
        </Link>

        <div className="profile-avatar">
          <img src={userIcon} alt="Аватар користувача" className="avatar-icon" />
        </div>

        <h2 className="profile-name">{user?.name || "Користувач"}</h2>
        <p className="profile-description">{user?.email}</p>

        <button className="edit-btn">Редагувати профіль</button>

        <div className="profile-links">
          <Link to="/saved" className="profile-link">Збережені рецепти</Link>
          <Link to="/my-recipes" className="profile-link">Мої рецепти</Link>
        </div>

        <button className="logout-btn" onClick={onLogout}>Вийти</button>
      </div>
    </div>
  );
}

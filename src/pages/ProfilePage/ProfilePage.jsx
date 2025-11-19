import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import './ProfilePage.css';
import userIcon from '../../assets/icons/user-icon.svg';

import { useAuth } from "../../context/AuthContext.jsx";

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const nav = useNavigate();

  // Локальний стан редагування
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(user?.name || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const fileInputRef = useRef(null);

  const onLogout = () => {
    nav("/", { replace: true });
    logout();
  };

  // почати редагування
  const startEdit = () => {
    setIsEditing(true);
    setDraftName(user?.name || "");
    setAvatarPreview(user?.avatar || null);
  };

  // скасувати
  const cancelEdit = () => {
    setIsEditing(false);
    setDraftName(user?.name || "");
    setAvatarPreview(user?.avatar || null);
  };

  // зберегти зміни
  const saveEdit = () => {
    updateProfile({
      name: draftName.trim() || user?.name || "Користувач",
      avatar: avatarPreview || null,
    });
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  // зміна файлу аватарки
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const displayName = user?.name || "Користувач";
  const displayEmail = user?.email || "";
  const displayAvatar = avatarPreview || user?.avatar || userIcon;
  const hasCustomAvatar = !!(avatarPreview || user?.avatar);

  return (
    <div className="profile-page">
      <h1 className="profile-title">Профіль</h1>

      <div className="profile-card">
        <Link to="/" className="close-btn" aria-label="Закрити та повернутись на головну">
          ×
        </Link>

        <button
          type="button"
          className={`profile-avatar ${isEditing ? "profile-avatar--editable" : ""}`}
          onClick={handleAvatarClick}
        >
          <img
            src={displayAvatar}
            alt="Аватар користувача"
            className={`avatar-icon ${
              hasCustomAvatar ? "avatar-icon--photo" : "avatar-icon--placeholder"
            }`}
          />
          {isEditing && (
            <span className="change-photo-hint">Змінити фото</span>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </button>

        {isEditing ? (
          <input
            className="profile-name-input"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder="Введіть ім’я"
          />
        ) : (
          <h2 className="profile-name">{displayName}</h2>
        )}

        <p className="profile-description">{displayEmail}</p>

        {isEditing ? (
          <div className="edit-actions">
            <button className="secondary-btn" onClick={cancelEdit}>
              Скасувати
            </button>
            <button className="primary-btn" onClick={saveEdit}>
              Зберегти
            </button>
          </div>
        ) : (
          <button className="edit-btn" onClick={startEdit}>
            Редагувати профіль
          </button>
        )}

        <div className="profile-links">
          <Link to="/saved" className="profile-link">
            Збережені рецепти
          </Link>
          <Link to="/my-recipes" className="profile-link">
            Мої рецепти
          </Link>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Вийти
        </button>
      </div>
    </div>
  );
}
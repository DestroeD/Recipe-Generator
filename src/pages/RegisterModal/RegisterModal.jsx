import { Link } from 'react-router-dom';
import React from 'react';
import './RegisterModal.css';

function Register() {
  return (
    <div className="register-page">
      <div className="register-modal">
        <Link to="/" className="close-btn" aria-label="Закрити та повернутись на головну">
          ×
        </Link>
        <h1 className="register-title">Реєстрація</h1>

        <form className="register-form">
          <input type="email" placeholder="Електронна пошта" className="register-input" />
          <input type="password" placeholder="Пароль" className="register-input" />
          <input type="password" placeholder="Підтвердження пароля" className="register-input" />
          <button type="submit" className="register-button">
            Зареєструватися
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;

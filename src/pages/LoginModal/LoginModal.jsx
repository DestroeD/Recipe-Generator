import { Link } from 'react-router-dom';
import React from 'react';
import './LoginModal.css';

function Login() {
  return (
    <div className="login-page">
      <div className="login-modal">
        <Link to="/" className="close-btn" aria-label="Закрити та повернутись на головну">
          ×
        </Link>
        <h1 className="login-title">Вхід</h1>

        <form className="login-form">
          <input type="email" placeholder="Електронна пошта" className="login-input" />
          <input type="password" placeholder="Пароль" className="login-input" />
          <button type="submit" className="login-button">
            Увійти
          </button>
        </form>

        <div className="login-links">
          <a href="#" className="forgot-link">
            Забули пароль?
          </a>
          <p className="register-text">Не маєте облікового запису?</p>
          <Link to="/register" className="register-link">
            Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

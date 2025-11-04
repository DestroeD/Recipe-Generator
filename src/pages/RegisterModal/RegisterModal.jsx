import React from 'react';
import './RegisterModal.css';

function Register() {
  return (
    <div className="register-page">
      <div className="register-modal">
        <button className="close-btn">×</button>
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

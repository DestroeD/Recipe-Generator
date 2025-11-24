import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./RegisterModal.css";

const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showErrors, setShowErrors] = useState(false); // головний прапорець
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const errors = {
    name: !name.trim()
      ? "Вкажіть ім’я."
      : name.trim().length < 2
      ? "Ім’я занадто коротке (мінімум 2 символи)."
      : "",
    email: !email.trim()
      ? "Вкажіть email."
      : !isEmail(email.trim())
      ? "Некоректний формат email."
      : "",
    password: !password
      ? "Вкажіть пароль."
      : password.length < 6
      ? "Закороткий пароль (мінімум 6 символів)."
      : "",
    confirm: !confirm
      ? "Підтвердіть пароль."
      : confirm !== password
      ? "Паролі не збігаються."
      : "",
  };

  const isValid = Object.values(errors).every((e) => e === "");

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setShowErrors(true);

    if (!isValid) return;

    try {
      setSubmitting(true);
      await register({ name: name.trim(), email: email.trim(), password });
      nav(from, { replace: true });
    } catch (err) {
      console.error(err);

      let msg = "Сталася помилка під час реєстрації.";

      if (err?.code === "auth/email-already-in-use") {
        msg = "Користувач з таким email вже існує.";
      } else if (err?.code === "auth/weak-password") {
        msg = "Пароль занадто слабкий (мінімум 6 символів).";
      } else if (err?.code === "auth/invalid-email") {
        msg = "Некоректний email.";
      }

      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-modal">
        <Link to="/" className="close-btn" aria-label="Закрити та повернутись на головну">
          ×
        </Link>
        <h1 className="register-title">Реєстрація</h1>

        {formError && (
          <p className="register-error" role="alert">
            {formError}
          </p>
        )}

        <form className="register-form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <input
              type="text"
              placeholder="Ім’я"
              className={`register-input ${
                showErrors && errors.name ? "is-invalid" : ""
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            {showErrors && errors.name && (
              <small className="error-text">{errors.name}</small>
            )}
          </div>

          <div className="field">
            <input
              type="email"
              placeholder="Електронна пошта"
              className={`register-input ${
                showErrors && errors.email ? "is-invalid" : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {showErrors && errors.email && (
              <small className="error-text">{errors.email}</small>
            )}
          </div>

          <div className="field">
            <input
              type="password"
              placeholder="Пароль"
              className={`register-input ${
                showErrors && errors.password ? "is-invalid" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {showErrors && errors.password && (
              <small className="error-text">{errors.password}</small>
            )}
          </div>

          <div className="field">
            <input
              type="password"
              placeholder="Підтвердження пароля"
              className={`register-input ${
                showErrors && errors.confirm ? "is-invalid" : ""
              }`}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
            {showErrors && errors.confirm && (
              <small className="error-text">{errors.confirm}</small>
            )}
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={submitting}
          >
            {submitting ? "Створюємо…" : "Зареєструватись"}
          </button>
        </form>
      </div>
    </div>
  );
}

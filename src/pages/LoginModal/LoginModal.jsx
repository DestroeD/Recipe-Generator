import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./LoginModal.css";

const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showErrors, setShowErrors] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fieldErr = {
    email: !email.trim()
      ? "Вкажіть email."
      : !isEmail(email.trim())
      ? "Некоректний формат email."
      : "",
    password: !password ? "Вкажіть пароль." : "",
  };
  const isValid = Object.values(fieldErr).every((e) => e === "");

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormErr("");
    setShowErrors(true);

    if (!isValid) return;

    try {
      setSubmitting(true);
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (e) {
      console.error(e);

      let msg = "Невірний email або пароль.";

      if (e?.code === "auth/invalid-credential") {
        msg = "Невірний email або пароль.";
      } else if (e?.code === "auth/user-not-found") {
        msg = "Користувача з таким email не знайдено.";
      } else if (e?.code === "auth/too-many-requests") {
        msg = "Забагато спроб входу. Спробуйте пізніше.";
      }

      setFormErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-modal">
        <Link to="/" className="close-btn" aria-label="Закрити та повернутись на головну">
          ×
        </Link>
        <h1 className="login-title">Вхід</h1>

        {formErr && <p className="login-error">{formErr}</p>}

        <form className="login-form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <input
              type="email"
              placeholder="Електронна пошта"
              className={`login-input ${showErrors && fieldErr.email ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
            {showErrors && fieldErr.email && (
              <small className="error-text">{fieldErr.email}</small>
            )}
          </div>

          <div className="field">
            <input
              type="password"
              placeholder="Пароль"
              className={`login-input ${showErrors && fieldErr.password ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {showErrors && fieldErr.password && (
              <small className="error-text">{fieldErr.password}</small>
            )}
          </div>

          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? "Входимо…" : "Увійти"}
          </button>
        </form>

        <div className="login-links">
          <a href="#" className="forgot-link">Забули пароль?</a>
          <p className="register-text">Не маєте облікового запису?</p>
          <Link to="/register" state={{ from }} className="register-link">Зареєструватися</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

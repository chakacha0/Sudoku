import { useState } from "react";
import { register, login } from "../api/authApi";
import {
  getErrorMessage,
  saveAuthSession,
} from "../utils/authHelper";
import "../Styles/AuthModal.css";

const TABS = {
  login: "login",
  register: "register",
};

const AuthForm = ({ onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState(TABS.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successName, setSuccessName] = useState("");

  const resetError = () => setError("");

  const switchTab = (tab) => {
    setActiveTab(tab);
    resetError();
    setIsSuccess(false);
  };

  const finishAuth = (name) => {
    setSuccessName(name);
    setIsSuccess(true);
    onSuccess?.(name);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetError();

    if (!email.trim() || !password.trim()) {
      setError("Заполните email и пароль");
      return;
    }

    setIsLoading(true);

    try {
      const data = await login(email.trim(), password);
      const name = saveAuthSession(data);
      finishAuth(name || email.trim().split("@")[0]);
    } catch (err) {
      setError(getErrorMessage(err, "Ошибка входа"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetError();

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен быть не короче 6 символов");
      return;
    }

    setIsLoading(true);

    try {
      const data = await register(username.trim(), email.trim(), password);
      const name = saveAuthSession(data, username.trim());
      finishAuth(name || username.trim());
    } catch (err) {
      setError(getErrorMessage(err, "Не удалось зарегистрироваться"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="auth-success">
        <p>Добро пожаловать, {successName}!</p>
        <button type="button" className="auth-submit-btn" onClick={onClose}>
          Продолжить
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="auth-tabs">
        <button
          type="button"
          className={`auth-tab ${activeTab === TABS.login ? "active" : ""}`}
          onClick={() => switchTab(TABS.login)}
        >
          Вход
        </button>
        <button
          type="button"
          className={`auth-tab ${activeTab === TABS.register ? "active" : ""}`}
          onClick={() => switchTab(TABS.register)}
        >
          Регистрация
        </button>
      </div>

      {activeTab === TABS.login ? (
        <form className="auth-form" onSubmit={handleLogin}>
          <label className="auth-field">
            <span className="auth-label">Email</span>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              autoComplete="email"
              disabled={isLoading}
            />
          </label>

          <label className="auth-field">
            <span className="auth-label">Пароль</span>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              autoComplete="current-password"
              disabled={isLoading}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleRegister}>
          <label className="auth-field">
            <span className="auth-label">Имя пользователя</span>
            <input
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя"
              autoComplete="username"
              disabled={isLoading}
            />
          </label>

          <label className="auth-field">
            <span className="auth-label">Email</span>
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              autoComplete="email"
              disabled={isLoading}
            />
          </label>

          <label className="auth-field">
            <span className="auth-label">Пароль</span>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              autoComplete="new-password"
              disabled={isLoading}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
      )}
    </>
  );
};

export default AuthForm;

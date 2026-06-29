const AuthRequired = ({ onLogin }) => (
  <div className="auth-required">
    <h2>Войдите, чтобы играть</h2>
    <p>Одиночная игра доступна только авторизованным пользователям.</p>
    <button type="button" className="auth-submit-btn" onClick={onLogin}>
      Войти или зарегистрироваться
    </button>
  </div>
);

export default AuthRequired;

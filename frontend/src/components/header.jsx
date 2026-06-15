import "../Styles/Header.css";

const Header = ({ onAuthClick, username }) => {
  return (
    <header className="main-header">
      <div className="header-center">
        <img className="frog" src="/frog3.svg" alt="Иконка" />
        <div className="header-content">
          <h1 className="header-title">Sudoku</h1>
          <div className="header-badge">Classic Game</div>
        </div>
        <img className="frog" src="/frog3.svg" alt="Иконка" />
      </div>

      <div className="header-user-area">
        <button
          type="button"
          className="header-user-btn"
          onClick={onAuthClick}
          title={username ? `Вы вошли как ${username}` : "Вход / Регистрация"}
        >
          <img src="/user.svg" alt="Аккаунт" />
          {username && <span className="header-username">{username}</span>}
        </button>
      </div>
    </header>
  );
};

export default Header;

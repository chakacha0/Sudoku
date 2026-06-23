import { useEffect, useRef } from "react";
import UserProfile from "./UserProfile";
import "../Styles/Header.css";
import "../Styles/UserProfile.css";

const Header = ({
  username,
  isProfileOpen,
  currentView,
  onUserClick,
  onCloseProfile,
  onLogout,
  onTitleClick,
  onLeaderboardClick,
}) => {
  const userAreaRef = useRef(null);
  const isLeaderboard = currentView === "leaderboard";

  useEffect(() => {
    if (!isProfileOpen) return;

    const handleClickOutside = (event) => {
      if (
        userAreaRef.current &&
        !userAreaRef.current.contains(event.target)
      ) {
        onCloseProfile();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onCloseProfile();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileOpen, onCloseProfile]);

  return (
    <header className="main-header">
      {!isLeaderboard && (
        <button
          type="button"
          className="header-leaderboard-btn"
          onClick={onLeaderboardClick}
        >
          Рейтинг
        </button>
      )}

      <div className="header-center">
        <img className="frog" src="/frog3.svg" alt="Иконка" />
        <div className="header-content">
          <button
            type="button"
            className={`header-title-btn ${isLeaderboard ? "header-title-btn--back" : ""}`}
            onClick={onTitleClick}
            title={isLeaderboard ? "Вернуться к игре" : "Sudoku"}
          >
            <h1 className="header-title">Sudoku</h1>
          </button>
          <div className="header-badge">Classic Game</div>
        </div>
        <img className="frog" src="/frog3.svg" alt="Иконка" />
      </div>

      <div className="header-user-area" ref={userAreaRef}>
        <button
          type="button"
          className={`header-user-btn ${isProfileOpen ? "active" : ""}`}
          onClick={onUserClick}
          title={
            username ? `Аккаунт: ${username}` : "Вход / Регистрация"
          }
        >
          <img src="/user.svg" alt="Аккаунт" />
          {username && <span className="header-username">{username}</span>}
        </button>

        {isProfileOpen && username && (
          <UserProfile onClose={onCloseProfile} onLogout={onLogout} />
        )}
      </div>
    </header>
  );
};

export default Header;

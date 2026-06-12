import "../Styles/Header.css";

const Header = () => {
  return (
    <header className="main-header">
      <img className="frog" src="/frog3.svg" alt="Иконка" />
      <div className="header-content">
        <h1 className="header-title">Sudoku</h1>
        <div className="header-badge">Classic Game</div>
      </div>
      <img className="frog" src="/frog3.svg" alt="Иконка" />
    </header>
  );
};
export default Header;

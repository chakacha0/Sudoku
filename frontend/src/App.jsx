import { useState } from "react";
import Header from "./components/header";
import Modal from "./components/Modal";
import AuthForm from "./components/AuthForm";
import Leaderboard from "./components/UsersStatistics";
import GameScreen from "./components/GameScreen";
import { useAuth } from "./hooks/useAuth";
import { useSudokuGame } from "./hooks/useSudokuGame";
import "./App.css";

function App() {
  const [difficulty, setDifficulty] = useState(5);
  const [currentView, setCurrentView] = useState("game");

  const auth = useAuth();
  const game = useSudokuGame(difficulty);

  const handleOpenLeaderboard = () => {
    auth.setIsProfileOpen(false);
    setCurrentView("leaderboard");
  };

  const handleOpenGame = () => {
    setCurrentView("game");
  };

  const handleLogout = () => {
    auth.handleLogout(game.resetScore);
  };

  return (
    <div className="container">
      <Header
        username={auth.username}
        isProfileOpen={auth.isProfileOpen}
        currentView={currentView}
        onUserClick={auth.handleUserClick}
        onCloseProfile={() => auth.setIsProfileOpen(false)}
        onLogout={handleLogout}
        onTitleClick={handleOpenGame}
        onLeaderboardClick={handleOpenLeaderboard}
      />

      {currentView === "leaderboard" ? (
        <Leaderboard currentUsername={auth.username} />
      ) : (
        <GameScreen
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          {...game}
        />
      )}

      <Modal isOpen={auth.isAuthOpen} onClose={() => auth.setIsAuthOpen(false)}>
        <AuthForm
          onClose={() => auth.setIsAuthOpen(false)}
          onSuccess={auth.handleAuthSuccess}
        />
      </Modal>
    </div>
  );
}

export default App;

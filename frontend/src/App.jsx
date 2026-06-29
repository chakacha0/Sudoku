import { useState } from "react";
import Header from "./components/header";
import Modal from "./components/Modal";
import AuthForm from "./components/AuthForm";
import AuthRequired from "./components/AuthRequired";
import Leaderboard from "./components/UsersStatistics";
import GameScreen from "./components/GameScreen";
import { useAuth } from "./hooks/useAuth";
import { useSudokuGame } from "./hooks/useSudokuGame";
import Lobby from "./components/TestSignalR";
import "./App.css";

function App() {
  const [difficulty, setDifficulty] = useState(5);
  const [currentView, setCurrentView] = useState("game");

  const auth = useAuth();
  const game = useSudokuGame(difficulty, auth.isLoggedIn);

  const requireAuth = () => {
    auth.setIsAuthOpen(true);
  };

  const handleOpenLeaderboard = () => {
    auth.setIsProfileOpen(false);
    setCurrentView("leaderboard");
  };

  const handleOpenSignalR = () => {
    auth.setIsProfileOpen(false);
    setCurrentView("signalr");
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
        onSignalRClick={handleOpenSignalR}
      />

      {currentView === "leaderboard" ? (
        <Leaderboard currentUsername={auth.username} />
      ) : currentView === "signalr" ? (
        <Lobby />
      ) : auth.isLoggedIn ? (
        <GameScreen
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          {...game}
        />
      ) : (
        <AuthRequired onLogin={requireAuth} />
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

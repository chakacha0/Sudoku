import { useEffect, useState } from "react";
import signalrService from "../hooks/signalrService";
import MultiplayerGame from "./MultiplayerGame";
import DifficultySelector from "./difficultySelector";
import "../Styles/MultiplayerGame.css";

const DEFAULT_DIFFICULTY = 5;

const Lobby = () => {
  const [playerName, setPlayerName] = useState("");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [gameTask, setGameTask] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [gameDifficulty, setGameDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [totalEmptyCells, setTotalEmptyCells] = useState(0);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    signalrService.start();

    const handleGameStarted = ({ task, difficulty, totalEmptyCells: total }) => {
      setGameTask(task);
      setGameDifficulty(difficulty ?? DEFAULT_DIFFICULTY);
      setTotalEmptyCells(total ?? 0);
      setIsStarting(false);
      setMessages((prev) => [
        ...prev,
        { user: "Система", message: "Игра началась — одно поле для всех!" },
      ]);
    };

    signalrService.on("RoomCreated", (code) => {
      setCurrentRoom(code);
      setIsHost(true);
    });

    signalrService.on("JoinedSuccess", (code) => {
      setCurrentRoom(code);
      setIsHost(false);
    });

    signalrService.on("UpdatePlayerList", (playerList) => {
      setPlayers(playerList);
    });

    signalrService.on("UserJoined", (name) => {
      setMessages((prev) => [
        ...prev,
        { user: "Система", message: `${name} вошёл в комнату` },
      ]);
    });

    signalrService.on("GameStarted", handleGameStarted);

    signalrService.on("Error", (msg) => {
      alert(msg);
      setIsStarting(false);
    });

    return () => {
      signalrService.off("RoomCreated");
      signalrService.off("JoinedSuccess");
      signalrService.off("UpdatePlayerList");
      signalrService.off("UserJoined");
      signalrService.off("GameStarted");
      signalrService.off("Error");
    };
  }, []);

  const handleCreateRoom = async () => {
    if (!playerName.trim()) return alert("Введите имя!");
    await signalrService.invoke("CreateRoom", playerName.trim());
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim() || !roomCodeInput.trim()) {
      return alert("Введите имя и код комнаты!");
    }
    await signalrService.invoke(
      "JoinRoom",
      roomCodeInput.trim().toUpperCase(),
      playerName.trim(),
    );
  };

  const handleStartGame = async () => {
    if (!currentRoom || !isHost) return;
    setIsStarting(true);
    await signalrService.invoke("StartNewGame", currentRoom, selectedDifficulty);
  };

  const handlePlayAgain = () => {
    setGameTask(null);
    setCurrentRoom(null);
    setIsHost(false);
    setPlayers([]);
    setMessages([]);
    setRoomCodeInput("");
    setIsStarting(false);
    setTotalEmptyCells(0);
  };

  if (gameTask) {
    return (
      <MultiplayerGame
        initialTask={gameTask}
        difficulty={gameDifficulty}
        roomCode={currentRoom}
        playerName={playerName.trim()}
        totalEmptyCells={totalEmptyCells}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (!currentRoom) {
    return (
      <div className="multiplayer-lobby">
        <div className="multiplayer-lobby__card">
          <h1 className="multiplayer-lobby__title">Судоку онлайн</h1>

          <input
            className="multiplayer-lobby__input multiplayer-lobby__input--name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Введите имя"
          />

          <div className="multiplayer-lobby__entry">
            <div className="multiplayer-lobby__column">
              <h3 className="multiplayer-lobby__column-title">Новая игра</h3>
              <p className="multiplayer-lobby__column-text">
                Создайте комнату и отправьте код другу
              </p>
              <button
                type="button"
                className="multiplayer-lobby__btn multiplayer-lobby__btn--primary"
                onClick={handleCreateRoom}
              >
                Создать игру
              </button>
            </div>

            <div className="multiplayer-lobby__column">
              <h3 className="multiplayer-lobby__column-title">Присоединиться</h3>
              <p className="multiplayer-lobby__column-text">
                Введите код комнаты от друга
              </p>
              <input
                className="multiplayer-lobby__input"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                placeholder="Код комнаты"
                maxLength={6}
              />
              <button
                type="button"
                className="multiplayer-lobby__btn"
                onClick={handleJoinRoom}
              >
                Присоединиться к игре
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="multiplayer-lobby">
      <div className="multiplayer-lobby__card">
        <h2>
          Код комнаты: <span style={{ color: "var(--color-main)" }}>{currentRoom}</span>
        </h2>
        <p>Отправьте этот код другу, чтобы он мог присоединиться.</p>
      </div>

      <div className="multiplayer-lobby__layout">
        <div className="multiplayer-lobby__players">
          <h4>Игроки ({players.length})</h4>
          <ul>
            {players.map((p, i) => (
              <li key={i}>🟢 {p}</li>
            ))}
          </ul>

          {isHost ? (
            <>
              <div className="multiplayer-lobby__difficulty">
                <p className="multiplayer-lobby__difficulty-label">Сложность игры</p>
                <DifficultySelector
                  currentDifficulty={selectedDifficulty}
                  setDifficulty={setSelectedDifficulty}
                />
              </div>

              <button
                type="button"
                className="multiplayer-lobby__btn multiplayer-lobby__btn--primary"
                style={{ marginTop: "20px", width: "100%" }}
                onClick={handleStartGame}
                disabled={isStarting || players.length < 1}
              >
                {isStarting ? "Запуск..." : "Начать игру"}
              </button>
            </>
          ) : (
            <p style={{ marginTop: "20px", color: "#666" }}>
              Ожидание старта от создателя комнаты...
            </p>
          )}
        </div>

        <div className="multiplayer-lobby__events">
          <h4>События</h4>
          {messages.map((m, i) => (
            <p key={i}>
              <strong>{m.user}:</strong> {m.message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lobby;

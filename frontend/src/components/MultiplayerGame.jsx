import { useCallback, useEffect, useRef, useState } from "react";
import GameScreen from "./GameScreen";
import PlayerProgressPanel from "./PlayerProgressPanel";
import MultiplayerResultModal from "./MultiplayerResultModal";
import { useMultiplayerGame } from "../hooks/useMultiplayerGame";
import signalrService from "../hooks/signalrService";
import { getDifficultyLabel } from "../constants/difficultyLevels";
import "../Styles/MultiplayerGame.css";

const normalizePlayers = (players = []) =>
  players.map((player) =>
    typeof player === "string"
      ? { name: player, filledCells: 0, mistakeCount: 0, status: "playing" }
      : { status: "playing", ...player },
  );

const MultiplayerGame = ({
  initialTask,
  difficulty,
  roomCode,
  playerName,
  totalEmptyCells: initialTotalEmpty,
  onPlayAgain,
}) => {
  const [players, setPlayers] = useState([]);
  const [totalEmptyCells, setTotalEmptyCells] = useState(initialTotalEmpty ?? 0);
  const [personalModal, setPersonalModal] = useState(null);
  const [personalModalDismissed, setPersonalModalDismissed] = useState(false);
  const [gameOverRankings, setGameOverRankings] = useState(null);
  const [gameOverDismissed, setGameOverDismissed] = useState(false);
  const finishReportedRef = useRef(false);

  useEffect(() => {
    const handleProgress = ({ totalEmptyCells: total, players: nextPlayers }) => {
      if (total != null) setTotalEmptyCells(total);
      setPlayers(normalizePlayers(nextPlayers));
    };

    const handleGameOver = ({ rankings }) => {
      setGameOverRankings(rankings ?? []);
      setGameOverDismissed(false);
    };

    signalrService.on("UpdatePlayerProgress", handleProgress);
    signalrService.on("GameOver", handleGameOver);

    return () => {
      signalrService.off("UpdatePlayerProgress");
      signalrService.off("GameOver");
    };
  }, []);

  const syncProgress = useCallback(
    async ({ filledCells, mistakeCount }) => {
      if (!roomCode) return;
      await signalrService.invoke(
        "UpdateProgress",
        roomCode,
        filledCells,
        mistakeCount,
      );
    },
    [roomCode],
  );

  const reportFinish = useCallback(
    async (result) => {
      if (!roomCode || finishReportedRef.current) return;
      finishReportedRef.current = true;
      setPersonalModal(result);
      setPersonalModalDismissed(false);
      await signalrService.invoke("ReportFinish", roomCode, result);
    },
    [roomCode],
  );

  const game = useMultiplayerGame(initialTask, {
    onProgressChange: syncProgress,
    onPlayerFinished: reportFinish,
  });

  const header = (
    <div className="multiplayer-game__info">
      <span>
        Комната: <strong>{roomCode}</strong>
      </span>
      <span>Сложность: {getDifficultyLabel(difficulty)}</span>
      <span>Пустых клеток: {totalEmptyCells}</span>
    </div>
  );

  const handlePlayAgain = useCallback(async () => {
    if (roomCode) {
      await signalrService.invoke("LeaveRoom", roomCode);
    }
    onPlayAgain?.();
  }, [roomCode, onPlayAgain]);

  const showPersonalModal = personalModal && !personalModalDismissed && !gameOverRankings;
  const showGameOverModal = gameOverRankings && !gameOverDismissed;

  return (
    <div className="multiplayer-game">
      {header}

      <div className="multiplayer-game__layout">
        <PlayerProgressPanel
          players={players}
          totalEmptyCells={totalEmptyCells}
          currentPlayerName={playerName}
        />

        <div className="multiplayer-game__board">
          <GameScreen
            {...game}
            totalScore={0}
            startNewGame={() => {}}
            showDifficultySelector={false}
            showNewGameButton={false}
            hideScore
            hideTimer
            showResultModal={false}
          />
        </div>
      </div>

      {showPersonalModal && (
        <MultiplayerResultModal
          variant={personalModal}
          players={players}
          currentPlayerName={playerName}
          onContinue={() => setPersonalModalDismissed(true)}
        />
      )}

      {showGameOverModal && (
        <MultiplayerResultModal
          variant="gameOver"
          rankings={gameOverRankings}
          currentPlayerName={playerName}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
};

export default MultiplayerGame;

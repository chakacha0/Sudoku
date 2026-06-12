import { formatTime } from "../utils/timeHelper";
import "../Styles/GameStats.css";

const GameStats = ({
  mistakeCount,
  maxMistakes,
  elapsedSeconds,
  isPaused,
  onTogglePause,
}) => {
  const isLimitReached = mistakeCount >= maxMistakes;

  return (
    <div className="game-stats">
      <div className="game-stats-timer-row">
        <span className="game-stats-timer">{formatTime(elapsedSeconds)}</span>
        <button
          type="button"
          className={`game-stats-pause-btn ${isPaused ? "paused" : ""}`}
          onClick={onTogglePause}
          title={isPaused ? "Продолжить" : "Пауза"}
        >
          {isPaused ? "▶" : "⏸"}
        </button>
      </div>
      <div className={`game-stats-mistakes ${isLimitReached ? "limit-reached" : ""}`}>
        Ошибки: {mistakeCount}/{maxMistakes}
      </div>
    </div>
  );
};

export default GameStats;

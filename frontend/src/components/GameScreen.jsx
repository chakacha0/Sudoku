import Board from "./board";
import NumberSelectore from "./numberSelector";
import DifficultySelector from "./difficultySelector";
import GameStats from "./gameStats";
import ResultModal from "./resultModal";
import { MAX_MISTAKES } from "../constants/gameConstants";

const GameScreen = ({
  difficulty,
  setDifficulty,
  board,
  initialBoard,
  notes,
  isNotesMode,
  isHintMode,
  selectedCell,
  errors,
  activeNumber,
  isTimerPaused = false,
  mistakeCount,
  hintCount,
  elapsedSeconds = 0,
  totalScore,
  history,
  isGameWon,
  isGameLost,
  setActiveNumber,
  setIsNotesMode,
  setIsTimerPaused = () => {},
  toggleHintMode,
  startNewGame,
  handleCellChange,
  handleCellClick,
  handleNoteToggle,
  handleNoteClear,
  undoMove,
  remainingNumbers,
  showDifficultySelector = true,
  showNewGameButton = true,
  hideScore = false,
  hideTimer = false,
  winButtonText = "Играть снова",
  loseButtonText = "Начать новую игру",
  showResultScore = true,
  showResultModal = true,
  onGameWon,
  onGameLost,
  header = null,
}) => {
  const handleWin = onGameWon ?? startNewGame;
  const handleLose = onGameLost ?? startNewGame;

  return (
    <>
      {header}

      {showDifficultySelector && setDifficulty && (
        <DifficultySelector
          currentDifficulty={difficulty}
          setDifficulty={setDifficulty}
        />
      )}

      <div className="main-game-area">
        <div className="board-wrapper">
          <Board
            board={board}
            initialBoard={initialBoard}
            notes={notes}
            isNotesMode={isNotesMode}
            selectedCell={selectedCell}
            onCellChange={handleCellChange}
            onCellClick={handleCellClick}
            onNoteToggle={handleNoteToggle}
            onNoteClear={handleNoteClear}
            errors={errors}
            activeNumber={activeNumber}
          />
          {isTimerPaused && !hideTimer && (
            <div className="board-pause-overlay">
              <span className="board-pause-label">Пауза</span>
            </div>
          )}
        </div>

        <div className="side-panel">
          <GameStats
            mistakeCount={mistakeCount}
            maxMistakes={MAX_MISTAKES}
            elapsedSeconds={elapsedSeconds}
            isPaused={isTimerPaused}
            totalScore={totalScore}
            onTogglePause={() => setIsTimerPaused((prev) => !prev)}
            hideScore={hideScore}
            hideTimer={hideTimer}
          />
          <div className="side-panel__divider" />
          <div className="side-panel__numbers">
            <NumberSelectore
              activeNumber={activeNumber}
              setActiveNumber={setActiveNumber}
              remainingNumbers={remainingNumbers}
            />
          </div>
          <div className="side-panel__divider" />
          <div className="tools-row">
            <button
              type="button"
              className="btn"
              onClick={() => setActiveNumber(activeNumber === 0 ? null : 0)}
              title="Очистить ячейку"
            >
              <img className="sterka" src="/sterka.svg" alt="sterka" />
            </button>
            <button
              type="button"
              className={`btn ${isNotesMode ? "active" : ""}`}
              onClick={setIsNotesMode}
              title="Режим заметок"
            >
              <img className="pen" src="/pen.svg" alt="pen" />
            </button>
            <button
              type="button"
              className="btn"
              onClick={undoMove}
              disabled={history.length === 0}
              title="Отменить ход"
            >
              <img className="strelka" src="/strelka.svg" alt="strelka" />
            </button>
            <button
              type="button"
              className={`btn btn--hint ${isHintMode ? "active" : ""}`}
              onClick={toggleHintMode}
              disabled={hintCount === 0}
              title="Подсказка"
            >
              <img className="pen" src="/hint.svg" alt="hint" />
              <span className="hint-count">{hintCount}</span>
            </button>
          </div>

          {showNewGameButton && (
            <button type="button" className="new-game-btn" onClick={startNewGame}>
              New game
            </button>
          )}
        </div>
      </div>

      {showResultModal && isGameWon && (
        <ResultModal
          title="Поздравляем! 🎉"
          message="Вы успешно решили судоку!"
          errorCount={mistakeCount}
          maxErrors={MAX_MISTAKES}
          buttonText={winButtonText}
          onButtonClick={handleWin}
          variant="win"
          score={totalScore}
          showScore={showResultScore}
        />
      )}

      {showResultModal && isGameLost && (
        <ResultModal
          title="Игра окончена"
          message="Превышено допустимое количество ошибок."
          errorCount={mistakeCount}
          maxErrors={MAX_MISTAKES}
          buttonText={loseButtonText}
          onButtonClick={handleLose}
          variant="lose"
          showScore={false}
        />
      )}
    </>
  );
};

export default GameScreen;

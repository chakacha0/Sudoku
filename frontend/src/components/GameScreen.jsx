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
  isTimerPaused,
  mistakeCount,
  hintCount,
  elapsedSeconds,
  totalScore,
  history,
  isGameWon,
  isGameLost,
  setActiveNumber,
  setIsNotesMode,
  setIsTimerPaused,
  toggleHintMode,
  startNewGame,
  handleCellChange,
  handleCellClick,
  handleNoteToggle,
  handleNoteClear,
  undoMove,
  remainingNumbers,
}) => (
  <>
    <DifficultySelector
      currentDifficulty={difficulty}
      setDifficulty={setDifficulty}
    />

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
        {isTimerPaused && (
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
            className="btn"
            onClick={undoMove}
            disabled={history.length === 0}
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

        <button className="new-game-btn" onClick={startNewGame}>
          New game
        </button>
      </div>
    </div>

    {isGameWon && (
      <ResultModal
        title="Поздравляем! 🎉"
        message="Вы успешно решили судоку!"
        errorCount={mistakeCount}
        maxErrors={MAX_MISTAKES}
        buttonText="Играть снова"
        onButtonClick={startNewGame}
        variant="win"
        score={totalScore}
      />
    )}

    {isGameLost && (
      <ResultModal
        title="Игра окончена"
        message="Превышено допустимое количество ошибок."
        errorCount={mistakeCount}
        maxErrors={MAX_MISTAKES}
        buttonText="Начать новую игру"
        onButtonClick={startNewGame}
        variant="lose"
      />
    )}
  </>
);

export default GameScreen;

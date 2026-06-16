import { useState, useEffect, useRef } from "react";
import { getNewGame, validateMove, getSolution } from "./api/sudokuApi";
import Board from "./components/board";
import NumberSelectore from "./components/numberSelector";
import DifficultySelector from "./components/difficultySelector";
import Header from "./components/header";
import Modal from "./components/Modal";
import AuthForm from "./components/AuthForm";
import ResultModal from "./components/resultModal";
import GameStats from "./components/gameStats";
import { calculateRemainingNumbers } from "./utils/sudokuHelper";
import {
  createEmptyNotes,
  toggleNote,
  clearNotesInCell,
} from "./utils/notesUtils";
import { MAX_MISTAKES } from "./constants/gameConstants";

import "./App.css";
import { getUserIdFromToken } from "./utils/authHelper";

function App() {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [activeNumber, setActiveNumber] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [notes, setNotes] = useState(() => createEmptyNotes());
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [difficulty, setDifficulty] = useState(5);
  const [history, setHistory] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || "",
  );

  const isGameOver = isGameWon || isGameLost;

  const elapsedRef = useRef(elapsedSeconds);
  const loadingRef = useRef(loading);
  const boardLoadedRef = useRef(false);

  useEffect(() => {
    elapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  useEffect(() => {
    loadingRef.current = loading;
    boardLoadedRef.current = board.length > 0;
  }, [loading, board.length]);

  const startNewGame = async () => {
    setLoading(true);
    setIsGameWon(false);
    setIsGameLost(false);
    setElapsedSeconds(0);
    setIsTimerPaused(false);
    localStorage.removeItem("sudoku_board");
    localStorage.removeItem("sudoku_initial");
    localStorage.removeItem("sudoku_errors");
    localStorage.removeItem("sudoku_mistakes");
    localStorage.removeItem("sudoku_history");
    localStorage.removeItem("sudoku_timer");
    localStorage.removeItem("sudoku_notes");

    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);

    try {
      const data = await getNewGame(difficulty, userId);
      const newCells = data.task;
      const solution = data.solution;
      setBoard(newCells);
      setSolution(solution);
      setInitialBoard(JSON.parse(JSON.stringify(newCells)));
      setErrors([]);
      setMistakeCount(0);
      setNotes(createEmptyNotes());
      setIsNotesMode(false);
      setSelectedCell(null);
    } catch (err) {
      console.error("Не удалось создать новую игру:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadGame = async () => {
      const savedBoard = localStorage.getItem("sudoku_board");
      const savedInitial = localStorage.getItem("sudoku_initial");
      const savedErrors = localStorage.getItem("sudoku_errors");
      const savedMistakes = localStorage.getItem("sudoku_mistakes");
      const savedHistory = localStorage.getItem("sudoku_history");
      const savedTimer = localStorage.getItem("sudoku_timer");
      const savedNotes = localStorage.getItem("sudoku_notes");

      if (savedBoard && savedInitial) {
        const parsedInitial = JSON.parse(savedInitial);
        const parsedBoard = JSON.parse(savedBoard);

        setBoard(parsedBoard);
        setInitialBoard(parsedInitial);

        if (savedErrors) {
          setErrors(JSON.parse(savedErrors));
        }

        if (savedMistakes) {
          const parsedMistakes = JSON.parse(savedMistakes);
          setMistakeCount(parsedMistakes);
          setIsGameLost(parsedMistakes >= MAX_MISTAKES);
        }

        if (savedHistory) setHistory(JSON.parse(savedHistory));

        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        }

        if (savedTimer) {
          const {
            elapsedSeconds: savedElapsed,
            isPaused,
            updatedAt,
          } = JSON.parse(savedTimer);
          let restoredElapsed = savedElapsed;

          if (!isPaused && updatedAt) {
            restoredElapsed += Math.floor((Date.now() - updatedAt) / 1000);
          }

          setElapsedSeconds(restoredElapsed);
          setIsTimerPaused(isPaused);
        }

        try {
          const recoveredSolution = await getSolution(parsedInitial);
          setSolution(recoveredSolution);
        } catch (err) {
          console.error("Не удалось восстановить решение с сервера", err);
        }

        setLoading(false);
      } else {
        await startNewGame();
      }
    };

    loadGame();
  }, []);

  useEffect(() => {
    if (!loading && board.length > 0) {
      localStorage.setItem("sudoku_board", JSON.stringify(board));
      localStorage.setItem("sudoku_initial", JSON.stringify(initialBoard));
      localStorage.setItem("sudoku_errors", JSON.stringify(errors));
      localStorage.setItem("sudoku_mistakes", JSON.stringify(mistakeCount));
      localStorage.setItem("sudoku_history", JSON.stringify(history));
      localStorage.setItem("sudoku_notes", JSON.stringify(notes));
      localStorage.setItem(
        "sudoku_timer",
        JSON.stringify({
          elapsedSeconds,
          isPaused: isTimerPaused,
          updatedAt: Date.now(),
        }),
      );
    }
  }, [
    board,
    initialBoard,
    errors,
    mistakeCount,
    elapsedSeconds,
    isTimerPaused,
    loading,
    history,
    notes,
  ]);

  useEffect(() => {
    if (board.length > 0 && !loading && !isGameLost) {
      const isAllFilled = board.every((row) => row.every((cell) => cell !== 0));

      if (isAllFilled && errors.length === 0) {
        setIsGameWon(true);
      }
    }
  }, [board, errors, loading, isGameLost]);

  useEffect(() => {
    setIsGameLost(mistakeCount >= MAX_MISTAKES);
  }, [mistakeCount]);

  useEffect(() => {
    if (loading || isTimerPaused || isGameOver) return;

    const timerId = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [loading, isTimerPaused, isGameOver]);

  useEffect(() => {
    const pauseTimerOnLeave = () => {
      if (loadingRef.current || !boardLoadedRef.current) return;

      setIsTimerPaused(true);
      localStorage.setItem(
        "sudoku_timer",
        JSON.stringify({
          elapsedSeconds: elapsedRef.current,
          isPaused: true,
          updatedAt: Date.now(),
        }),
      );
    };

    const handleVisibilityChange = () => {
      if (document.hidden) pauseTimerOnLeave();
    };

    window.addEventListener("pagehide", pauseTimerOnLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", pauseTimerOnLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleCellChange = (row, col, value) => {
    if (isGameOver || isTimerPaused) return;

    if (!solution || solution.length === 0) {
      console.warn("Решение еще загружается...");
      return;
    }

    if (initialBoard[row][col] !== 0) return;

    if (board[row][col] === value) return;

    setHistory((prev) =>
      [
        ...prev,
        {
          board: JSON.parse(JSON.stringify(board)),
          errors: [...errors],
          mistakeCount,
          notes: JSON.parse(JSON.stringify(notes)),
        },
      ].slice(-50),
    );

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = value;
    setBoard(newBoard);
    setNotes((prev) => clearNotesInCell(prev, row, col));

    if (value === 0) {
      setErrors((prev) => prev.filter((e) => e !== `${row}-${col}`));
      return;
    }

    const isCorrect = value === solution[row][col];

    if (!isCorrect) {
      setErrors((prev) => [...new Set([...prev, `${row}-${col}`])]);
      setMistakeCount((prev) => prev + 1);
    } else {
      setErrors((prev) => prev.filter((e) => e !== `${row}-${col}`));
    }
  };

  const handleNoteToggle = (row, col, value) => {
    if (
      isGameOver ||
      isTimerPaused ||
      initialBoard[row][col] !== 0 ||
      board[row][col] !== 0
    ) {
      return;
    }

    setNotes((prev) => toggleNote(prev, row, col, value));
  };

  const handleNoteClear = (row, col) => {
    if (isGameOver || isTimerPaused || initialBoard[row][col] !== 0) return;
    setNotes((prev) => clearNotesInCell(prev, row, col));
  };

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });

    if (isGameOver || isTimerPaused || initialBoard[row][col] !== 0) return;

    if (isNotesMode) {
      if (activeNumber === 0) {
        handleNoteClear(row, col);
      } else if (activeNumber >= 1 && activeNumber <= 9) {
        handleNoteToggle(row, col, activeNumber);
      }
      return;
    }

    if (activeNumber !== null) {
      handleCellChange(row, col, activeNumber);
    }
  };

  const undoMove = () => {
    if (isGameOver || isTimerPaused || history.length === 0) return;

    const lastState = history[history.length - 1];

    setBoard(lastState.board);
    setErrors(lastState.errors);
    setMistakeCount(lastState.mistakeCount ?? 0);
    setNotes(lastState.notes ?? createEmptyNotes());

    setHistory((prev) => prev.slice(0, -1));
  };

  const remainingNumbers = calculateRemainingNumbers(board, errors);

  return (
    <div className="container">
      <Header onAuthClick={() => setIsAuthOpen(true)} username={username} />
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
              onClick={() => setIsNotesMode((prev) => !prev)}
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

      <Modal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)}>
        <AuthForm
          onClose={() => setIsAuthOpen(false)}
          onSuccess={(name) => setUsername(name)}
        />
      </Modal>
    </div>
  );
}

export default App;

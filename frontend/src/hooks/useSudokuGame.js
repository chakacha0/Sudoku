import { useState, useEffect, useRef, useCallback } from "react";
import { getNewGame, validateMove, getSolution } from "../api/sudokuApi";
import { calculateRemainingNumbers } from "../utils/sudokuHelper";
import {
  createEmptyNotes,
  toggleNote,
  clearNotesInCell,
  applyPlacedNumberToNotes,
} from "../utils/notesUtils";
import { MAX_MISTAKES } from "../constants/gameConstants";
import { getAccessToken, getUserIdFromToken } from "../utils/authHelper";
import {
  clearSavedGame,
  loadSavedGame,
  saveGameToStorage,
  savePausedTimer,
} from "../utils/gameStorage";

export const useSudokuGame = (difficulty) => {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [activeNumber, setActiveNumber] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [notes, setNotes] = useState(() => createEmptyNotes());
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [isHintMode, setIsHintMode] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

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

  const startNewGame = useCallback(async () => {
    setLoading(true);
    setIsGameWon(false);
    setIsGameLost(false);
    setElapsedSeconds(0);
    setIsTimerPaused(false);
    setHistory([]);
    setErrors([]);
    setMistakeCount(0);
    setHintCount(2);
    setNotes(createEmptyNotes());
    setTotalScore(0);
    clearSavedGame();

    const token = getAccessToken();
    const userId = getUserIdFromToken(token);

    try {
      const data = await getNewGame(difficulty, userId);
      setBoard(data.task);
      setSolution(data.solution);
      setInitialBoard(JSON.parse(JSON.stringify(data.task)));
      setIsNotesMode(false);
      setIsHintMode(false);
      setSelectedCell(null);
    } catch (err) {
      console.error("Не удалось создать новую игру:", err);
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  useEffect(() => {
    const loadGame = async () => {
      const saved = loadSavedGame();

      if (saved) {
        setBoard(saved.board);
        setInitialBoard(saved.initialBoard);
        setErrors(saved.errors);
        setMistakeCount(saved.mistakeCount);
        setHintCount(saved.hintCount);
        setIsGameLost(saved.mistakeCount >= MAX_MISTAKES);
        setHistory(saved.history);
        setNotes(saved.notes ?? createEmptyNotes());
        setTotalScore(saved.totalScore);

        if (saved.timer) {
          setElapsedSeconds(saved.timer.elapsedSeconds);
          setIsTimerPaused(saved.timer.isPaused);
        }

        try {
          const recoveredSolution = await getSolution(saved.initialBoard);
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
  }, [startNewGame]);

  useEffect(() => {
    if (!loading && board.length > 0) {
      saveGameToStorage({
        board,
        initialBoard,
        errors,
        mistakeCount,
        hintCount,
        totalScore,
        history,
        notes,
        elapsedSeconds,
        isTimerPaused,
      });
    }
  }, [
    board,
    initialBoard,
    errors,
    mistakeCount,
    hintCount,
    totalScore,
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
    if (hintCount <= 0) setIsHintMode(false);
  }, [hintCount]);

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
      savePausedTimer(elapsedRef.current);
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

  const handleCellChange = async (row, col, value) => {
    if (isGameOver || isTimerPaused) return;
    if (!solution || solution.length === 0) return;
    if (initialBoard[row][col] !== 0) return;
    if (board[row][col] === value) return;

    setHistory((prev) =>
      [
        ...prev,
        {
          board: JSON.parse(JSON.stringify(board)),
          errors: [...errors],
          mistakeCount,
          totalScore,
          notes: JSON.parse(JSON.stringify(notes)),
        },
      ].slice(-50),
    );

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = value;
    setBoard(newBoard);
    setNotes((prev) => applyPlacedNumberToNotes(prev, row, col, value));

    if (value === 0) {
      setErrors((prev) => prev.filter((e) => e !== `${row}-${col}`));
      return;
    }

    const token = getAccessToken();
    const userId = getUserIdFromToken(token);
    let nextScore = totalScore;
    let isCorrect = value === solution[row][col];

    if (userId) {
      try {
        const result = await validateMove(
          userId,
          row,
          col,
          newBoard,
          elapsedSeconds,
        );
        nextScore = result.score ?? totalScore;
        isCorrect = result.isCorrect ?? isCorrect;
      } catch (error) {
        console.error("Ошибка при проверке хода:", error);
      }
    }

    setTotalScore(nextScore);

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

  const getHint = (row, col) => {
    if (isGameOver || isTimerPaused) return;
    if (!solution || solution.length === 0) return;
    if (initialBoard[row][col] !== 0 || board[row][col] !== 0) return;
    if (hintCount <= 0) return;

    const correctValue = solution[row][col];

    setHistory((prev) =>
      [
        ...prev,
        {
          board: JSON.parse(JSON.stringify(board)),
          errors: [...errors],
          mistakeCount,
          totalScore,
          notes: JSON.parse(JSON.stringify(notes)),
          hintCount,
        },
      ].slice(-50),
    );

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = correctValue;
    setBoard(newBoard);
    setNotes((prev) => applyPlacedNumberToNotes(prev, row, col, correctValue));
    setErrors((prev) => prev.filter((e) => e !== `${row}-${col}`));
    setHintCount((prev) => prev - 1);
    setIsHintMode(false);
  };

  const toggleNotesMode = useCallback(() => {
    setIsNotesMode((prev) => {
      if (!prev) setIsHintMode(false);
      return !prev;
    });
  }, []);

  const toggleHintMode = useCallback(() => {
    if (hintCount <= 0) return;
    setIsHintMode((prev) => {
      if (!prev) setIsNotesMode(false);
      return !prev;
    });
  }, [hintCount]);

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

    if (isHintMode) {
      getHint(row, col);
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
    setNotes(lastState.notes ?? createEmptyNotes());
    setHistory((prev) => prev.slice(0, -1));

    if (lastState.hintCount !== undefined) {
      setHintCount(lastState.hintCount);
    }
  };

  const resetScore = () => setTotalScore(0);

  return {
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
    setIsNotesMode: toggleNotesMode,
    setIsTimerPaused,
    toggleHintMode,
    startNewGame,
    handleCellChange,
    handleCellClick,
    handleNoteToggle,
    handleNoteClear,
    undoMove,
    resetScore,
    remainingNumbers: calculateRemainingNumbers(board, errors),
  };
};

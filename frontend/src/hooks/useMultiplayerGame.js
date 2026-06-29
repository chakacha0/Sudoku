import { useState, useEffect, useCallback, useRef } from "react";
import { getSolution } from "../api/sudokuApi";
import { calculateRemainingNumbers, countCorrectFilledCells } from "../utils/sudokuHelper";
import {
  createEmptyNotes,
  toggleNote,
  clearNotesInCell,
  applyPlacedNumberToNotes,
} from "../utils/notesUtils";
import { MAX_MISTAKES } from "../constants/gameConstants";

const cloneBoard = (board) => {
  if (!Array.isArray(board) || board.length !== 9) {
    return Array.from({ length: 9 }, () => Array(9).fill(0));
  }

  return board.map((row) =>
    Array.isArray(row) && row.length === 9 ? [...row] : Array(9).fill(0),
  );
};

const pushHistory = (prev, snapshot) => [...prev, snapshot].slice(-50);

export const useMultiplayerGame = (initialTask, { onProgressChange, onPlayerFinished } = {}) => {
  const [initialBoard] = useState(() => cloneBoard(initialTask));
  const [board, setBoard] = useState(() => cloneBoard(initialTask));
  const [solution, setSolution] = useState([]);
  const [errors, setErrors] = useState([]);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [activeNumber, setActiveNumber] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [notes, setNotes] = useState(() => createEmptyNotes());
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [isHintMode, setIsHintMode] = useState(false);
  const [hintCount, setHintCount] = useState(2);
  const [history, setHistory] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);

  const isGameOver = isGameWon || isGameLost;
  const finishReportedRef = useRef(false);

  useEffect(() => {
    getSolution(initialBoard)
      .then(setSolution)
      .catch((err) => console.error("Не удалось загрузить решение:", err));
  }, [initialBoard]);

  useEffect(() => {
    if (isGameOver) return;

    const isAllFilled = board.every((row) => row.every((cell) => cell !== 0));
    if (isAllFilled && errors.length === 0) {
      setIsGameWon(true);
    }
  }, [board, errors, isGameOver]);

  useEffect(() => {
    setIsGameLost(mistakeCount >= MAX_MISTAKES);
  }, [mistakeCount]);

  useEffect(() => {
    if (hintCount <= 0) setIsHintMode(false);
  }, [hintCount]);

  useEffect(() => {
    if (!onProgressChange || isGameOver) return;

    onProgressChange({
      filledCells: countCorrectFilledCells(board, initialBoard, solution),
      mistakeCount,
    });
  }, [board, initialBoard, solution, mistakeCount, onProgressChange, isGameOver]);

  useEffect(() => {
    if (finishReportedRef.current || !onPlayerFinished) return;

    if (isGameWon) {
      finishReportedRef.current = true;
      onPlayerFinished("won");
    } else if (isGameLost) {
      finishReportedRef.current = true;
      onPlayerFinished("lost");
    }
  }, [isGameWon, isGameLost, onPlayerFinished]);

  const saveSnapshot = useCallback(
    () => ({
      board: cloneBoard(board),
      errors: [...errors],
      mistakeCount,
      notes: JSON.parse(JSON.stringify(notes)),
      hintCount,
    }),
    [board, errors, mistakeCount, notes, hintCount],
  );

  const handleCellChange = useCallback(
    (row, col, value) => {
      if (isGameOver) return;
      if (!solution || solution.length === 0) return;
      if (initialBoard[row][col] !== 0) return;
      if (board[row][col] === value) return;

      setHistory((prev) => pushHistory(prev, saveSnapshot()));

      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = value;
      setBoard(newBoard);
      setNotes((prev) => applyPlacedNumberToNotes(prev, row, col, value));

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
    },
    [isGameOver, solution, initialBoard, board, saveSnapshot],
  );

  const handleNoteToggle = useCallback(
    (row, col, value) => {
      if (
        isGameOver ||
        initialBoard[row][col] !== 0 ||
        board[row][col] !== 0
      ) {
        return;
      }

      setNotes((prev) => toggleNote(prev, row, col, value));
    },
    [isGameOver, initialBoard, board],
  );

  const handleNoteClear = useCallback(
    (row, col) => {
      if (isGameOver || initialBoard[row][col] !== 0) return;
      setNotes((prev) => clearNotesInCell(prev, row, col));
    },
    [isGameOver, initialBoard],
  );

  const getHint = useCallback(
    (row, col) => {
      if (isGameOver) return;
      if (!solution || solution.length === 0) return;
      if (initialBoard[row][col] !== 0 || board[row][col] !== 0) return;
      if (hintCount <= 0) return;

      const correctValue = solution[row][col];

      setHistory((prev) => pushHistory(prev, saveSnapshot()));

      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = correctValue;
      setBoard(newBoard);
      setNotes((prev) =>
        applyPlacedNumberToNotes(prev, row, col, correctValue),
      );
      setErrors((prev) => prev.filter((e) => e !== `${row}-${col}`));
      setHintCount((prev) => prev - 1);
      setIsHintMode(false);
    },
    [isGameOver, solution, initialBoard, board, hintCount, saveSnapshot],
  );

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

  const handleCellClick = useCallback(
    (row, col) => {
      setSelectedCell({ row, col });

      if (isGameOver || initialBoard[row][col] !== 0) return;

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
    },
    [
      isGameOver,
      initialBoard,
      isNotesMode,
      isHintMode,
      activeNumber,
      handleNoteClear,
      handleNoteToggle,
      getHint,
      handleCellChange,
    ],
  );

  const undoMove = useCallback(() => {
    if (isGameOver || history.length === 0) return;

    const lastState = history[history.length - 1];

    setBoard(lastState.board);
    setErrors(lastState.errors);
    setNotes(lastState.notes ?? createEmptyNotes());
    setMistakeCount(lastState.mistakeCount);
    setHistory((prev) => prev.slice(0, -1));

    if (lastState.hintCount !== undefined) {
      setHintCount(lastState.hintCount);
    }
  }, [isGameOver, history]);

  return {
    board,
    initialBoard,
    notes,
    isNotesMode,
    isHintMode,
    selectedCell,
    errors,
    activeNumber,
    mistakeCount,
    hintCount,
    history,
    isGameWon,
    isGameLost,
    setActiveNumber,
    setIsNotesMode: toggleNotesMode,
    toggleHintMode,
    handleCellChange,
    handleCellClick,
    handleNoteToggle,
    handleNoteClear,
    undoMove,
    remainingNumbers: calculateRemainingNumbers(board, errors),
  };
};

export const GAME_STORAGE_KEYS = {
  board: "sudoku_board",
  initial: "sudoku_initial",
  errors: "sudoku_errors",
  mistakes: "sudoku_mistakes",
  history: "sudoku_history",
  timer: "sudoku_timer",
  notes: "sudoku_notes",
  totalScore: "total_score",
  hints: "sudoku_hints",
};

export const clearSavedGame = () => {
  Object.values(GAME_STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};

export const saveGameToStorage = ({
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
}) => {
  localStorage.setItem(GAME_STORAGE_KEYS.board, JSON.stringify(board));
  localStorage.setItem(GAME_STORAGE_KEYS.initial, JSON.stringify(initialBoard));
  localStorage.setItem(GAME_STORAGE_KEYS.errors, JSON.stringify(errors));
  localStorage.setItem(GAME_STORAGE_KEYS.mistakes, JSON.stringify(mistakeCount));
  localStorage.setItem(GAME_STORAGE_KEYS.hints, JSON.stringify(hintCount));
  localStorage.setItem(GAME_STORAGE_KEYS.totalScore, JSON.stringify(totalScore));
  localStorage.setItem(GAME_STORAGE_KEYS.history, JSON.stringify(history));
  localStorage.setItem(GAME_STORAGE_KEYS.notes, JSON.stringify(notes));
  localStorage.setItem(
    GAME_STORAGE_KEYS.timer,
    JSON.stringify({
      elapsedSeconds,
      isPaused: isTimerPaused,
      updatedAt: Date.now(),
    }),
  );
};

export const loadSavedGame = () => {
  const savedBoard = localStorage.getItem(GAME_STORAGE_KEYS.board);
  const savedInitial = localStorage.getItem(GAME_STORAGE_KEYS.initial);

  if (!savedBoard || !savedInitial) {
    return null;
  }

  const savedTimer = localStorage.getItem(GAME_STORAGE_KEYS.timer);
  let timer = null;

  if (savedTimer) {
    const parsed = JSON.parse(savedTimer);
    let elapsedSeconds = parsed.elapsedSeconds;

    if (!parsed.isPaused && parsed.updatedAt) {
      elapsedSeconds += Math.floor((Date.now() - parsed.updatedAt) / 1000);
    }

    timer = {
      elapsedSeconds,
      isPaused: parsed.isPaused,
    };
  }

  return {
    board: JSON.parse(savedBoard),
    initialBoard: JSON.parse(savedInitial),
    errors: JSON.parse(localStorage.getItem(GAME_STORAGE_KEYS.errors) || "[]"),
    mistakeCount: JSON.parse(
      localStorage.getItem(GAME_STORAGE_KEYS.mistakes) || "0",
    ),
    hintCount: JSON.parse(
      localStorage.getItem(GAME_STORAGE_KEYS.hints) || "2",
    ),
    history: JSON.parse(localStorage.getItem(GAME_STORAGE_KEYS.history) || "[]"),
    notes: JSON.parse(localStorage.getItem(GAME_STORAGE_KEYS.notes) || "null"),
    totalScore: JSON.parse(
      localStorage.getItem(GAME_STORAGE_KEYS.totalScore) || "0",
    ),
    timer,
  };
};

export const savePausedTimer = (elapsedSeconds) => {
  localStorage.setItem(
    GAME_STORAGE_KEYS.timer,
    JSON.stringify({
      elapsedSeconds,
      isPaused: true,
      updatedAt: Date.now(),
    }),
  );
};

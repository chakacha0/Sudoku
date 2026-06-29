export const calculateRemainingNumbers = (board, errors = []) => {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  if (!board || board.length === 0) return counts;

  board.forEach((row, rowIndex) => {
    row.forEach((num, colIndex) => {
      if (num !== 0) {
        const cellId = `${rowIndex}-${colIndex}`;

        if (!errors.includes(cellId)) {
          counts[num] = (counts[num] || 0) + 1;
        }
      }
    });
  });

  const remaining = {};
  for (let i = 1; i <= 9; i++) {
    remaining[i] = Math.max(0, 9 - counts[i]);
  }
  return remaining;
};

export const countEmptyCells = (board) => {
  if (!board?.length) return 0;

  return board.reduce(
    (total, row) => total + row.filter((cell) => cell === 0).length,
    0,
  );
};

export const countPlayerFilledCells = (board, initialBoard) => {
  if (!board?.length || !initialBoard?.length) return 0;

  let filled = 0;

  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (initialBoard[row][col] === 0 && board[row][col] !== 0) {
        filled += 1;
      }
    }
  }

  return filled;
};

export const countCorrectFilledCells = (board, initialBoard, solution) => {
  if (!board?.length || !initialBoard?.length || !solution?.length) return 0;

  let filled = 0;

  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (
        initialBoard[row][col] === 0 &&
        board[row][col] !== 0 &&
        board[row][col] === solution[row][col]
      ) {
        filled += 1;
      }
    }
  }

  return filled;
};

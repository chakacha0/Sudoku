export const createEmptyNotes = () =>
  Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => []),
  );

export const toggleNote = (notes, row, col, value) => {
  if (value < 1 || value > 9) return notes;

  const newNotes = notes.map((r) => r.map((c) => [...c]));
  const cellNotes = newNotes[row][col];
  const index = cellNotes.indexOf(value);

  if (index >= 0) {
    cellNotes.splice(index, 1);
  } else {
    cellNotes.push(value);
    cellNotes.sort((a, b) => a - b);
  }

  return newNotes;
};

export const clearNotesInCell = (notes, row, col) => {
  const newNotes = notes.map((r) => r.map((c) => [...c]));
  newNotes[row][col] = [];
  return newNotes;
};

const removeValueFromCellNotes = (notes, row, col, value) => {
  const index = notes[row][col].indexOf(value);
  if (index >= 0) {
    notes[row][col].splice(index, 1);
  }
};

export const removeNoteFromPeers = (notes, row, col, value) => {
  if (value < 1 || value > 9) return notes;

  const newNotes = notes.map((r) => r.map((c) => [...c]));

  for (let c = 0; c < 9; c++) {
    if (c !== col) {
      removeValueFromCellNotes(newNotes, row, c, value);
    }
  }

  for (let r = 0; r < 9; r++) {
    if (r !== row) {
      removeValueFromCellNotes(newNotes, r, col, value);
    }
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (r !== row || c !== col) {
        removeValueFromCellNotes(newNotes, r, c, value);
      }
    }
  }

  return newNotes;
};

export const applyPlacedNumberToNotes = (notes, row, col, value) => {
  const clearedCell = clearNotesInCell(notes, row, col);
  if (value === 0) return clearedCell;
  return removeNoteFromPeers(clearedCell, row, col, value);
};

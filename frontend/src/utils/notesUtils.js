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

export const calculateRemainingNumbers = (board, errors = []) => {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  if (!board || board.length === 0) return counts;

  // Проходим по всем строкам и колонкам
  board.forEach((row, rowIndex) => {
    row.forEach((num, colIndex) => {
      if (num !== 0) {
        // Создаем ID ячейки, как в твоем массиве ошибок (например "0-5")
        const cellId = `${rowIndex}-${colIndex}`;
        
        // Считаем число ТОЛЬКО если его нет в списке ошибок
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
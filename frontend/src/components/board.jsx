import Cell from "./cell";
import "../Styles/Board.css";

const Board = ({
  board,
  initialBoard,
  notes,
  isNotesMode,
  selectedCell,
  onCellChange,
  onCellClick,
  onNoteToggle,
  onNoteClear,
  errors,
}) => {
  return (
    <div className="sudoku-grid">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="sudoku-row">
          {row.map((cellValue, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cellValue}
              notes={notes[rowIndex][colIndex]}
              isReadOnly={initialBoard[rowIndex][colIndex] !== 0}
              isError={errors && errors.includes(`${rowIndex}-${colIndex}`)}
              isSelected={
                selectedCell?.row === rowIndex &&
                selectedCell?.col === colIndex
              }
              isNotesMode={isNotesMode}
              onChange={(newValue) =>
                onCellChange(rowIndex, colIndex, newValue)
              }
              onClick={() => onCellClick(rowIndex, colIndex)}
              onNoteToggle={(value) => onNoteToggle(rowIndex, colIndex, value)}
              onNoteClear={() => onNoteClear(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;

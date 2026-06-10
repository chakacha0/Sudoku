import Cell from "./Cell";

const Board = ({ board, initialBoard, onCellChange, onCellClick, errors }) => {
  return (
    <div className="sudoku-grid">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="sudoku-row">
          {row.map((cellValue, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cellValue}
              isReadOnly={initialBoard[rowIndex][colIndex] !== 0}
              isError={errors && errors.includes(`${rowIndex}-${colIndex}`)}
              onChange={(newValue) =>
                onCellChange(rowIndex, colIndex, newValue)
              }
              onClick={() => onCellClick(rowIndex, colIndex)} // <--- Добавляем проброс клика
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;

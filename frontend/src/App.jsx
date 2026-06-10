import { useState, useEffect } from "react";
import { getNewGame, validateMove } from "./api/sudokuApi";
import Board from "./components/board";
import NumberSelectore from "./components/numberSelector";
import DifficultySelector from "./components/difficultySelector";
import Header from "./components/header";

import "./App.css";

function App() {
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [activeNumber, setActiveNumber] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [difficulty, setDifficulty] = useState(5);

  // Функция для создания новой игры
  const startNewGame = async () => {
    setLoading(true);
    // Принудительно очищаем старое сохранение, чтобы оно не перезаписало новую игру
    localStorage.removeItem("sudoku_board");
    localStorage.removeItem("sudoku_initial");
    localStorage.removeItem("sudoku_errors");

    const newCells = await getNewGame(difficulty);
    console.log("Запрашиваю сложность:", difficulty);
    setBoard(newCells);
    setInitialBoard(JSON.parse(JSON.stringify(newCells)));
    setErrors([]); // Сбрасываем ошибки
    setLoading(false);
  };

  // 1. ЭФФЕКТ ЗАГРУЗКИ: Срабатывает ОДИН РАЗ при запуске сайта
  useEffect(() => {
    const savedBoard = localStorage.getItem("sudoku_board");
    const savedInitial = localStorage.getItem("sudoku_initial");
    const savedErrors = localStorage.getItem("sudoku_errors");

    if (savedBoard && savedInitial) {
      // Если нашли сохранение — загружаем его
      setBoard(JSON.parse(savedBoard));
      setInitialBoard(JSON.parse(savedInitial));
      if (savedErrors) setErrors(JSON.parse(savedErrors));
      setLoading(false);
    } else {
      // Если сохранения нет — запрашиваем новую игру с бэкенда
      startNewGame();
    }
  }, []);

  // 2. ЭФФЕКТ СОХРАНЕНИЯ: Срабатывает при каждом изменении состояния
  useEffect(() => {
    // Сохраняем только если игра уже загружена
    if (!loading && board.length > 0) {
      localStorage.setItem("sudoku_board", JSON.stringify(board));
      localStorage.setItem("sudoku_initial", JSON.stringify(initialBoard));
      localStorage.setItem("sudoku_errors", JSON.stringify(errors));
    }
  }, [board, initialBoard, errors, loading]);

  const handleCellChange = async (row, col, value) => {
    // Если клетка изначально заполнена (из initialBoard), ничего не делаем
    if (initialBoard[row][col] !== 0) return;
    if (validateMove(Board, row, col, value) == 0) return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = value;
    setBoard(newBoard);

    if (value === 0) {
      setErrors((prev) => prev.filter((e) => e !== `${row}-${col}`));
      return;
    }

    const isValid = await validateMove(newBoard, row, col, value);
    if (!isValid) {
      setErrors((prev) => [...new Set([...prev, `${row}-${col}`])]);
    } else {
      setErrors((prev) => prev.filter((e) => e !== `${row}-${col}`));
    }
  };

  const handleCellClick = (row, col) => {
    // Если в панели выбрано число (включая 0/ластик), записываем его при клике
    if (activeNumber !== null) {
      handleCellChange(row, col, activeNumber);
    }
  };

  if (loading) return <h1 className="loading">Загрузка...</h1>;

  return (
    <div className="container">
      <Header />
      <DifficultySelector
        currentDifficulty={difficulty}
        setDifficulty={setDifficulty}
      />

      <div className="main-game-area">
        <Board
          board={board}
          initialBoard={initialBoard}
          onCellChange={handleCellChange} // Оставляем для клавиатуры
          onCellClick={handleCellClick} // Добавляем для клика по панельке
          errors={errors}
        />
        <div className="side-panel">
          <NumberSelectore
            activeNumber={activeNumber}
            setActiveNumber={setActiveNumber}
          />

          <button className="new-game-btn" onClick={startNewGame}>
            Новая игра
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

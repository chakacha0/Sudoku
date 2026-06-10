import React from "react";
import "../Styles/Difficult.css";

const DifficultySelector = ({ currentDifficulty, setDifficulty }) => {
  // Определяем пресеты сложности: название и количество пустых клеток
  const levels = [
    { label: "Начинающий", value: 1 },
    { label: "Легкий", value: 2 },
    { label: "Средний", value: 3 },
    { label: "Сложный", value: 4 },
    { label: "Эксперт", value: 5 },
    { label: "Экстремальный", value: 6 },
  ];

  return (
    <div className="difficulty-container">
      <div className="difficulty-buttons">
        {levels.map((level) => (
          <button
            key={level.value}
            className={`diff-btn ${currentDifficulty === level.value ? "active" : ""}`}
            onClick={() => setDifficulty(level.value)}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;

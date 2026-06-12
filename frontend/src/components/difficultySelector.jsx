import React from "react";
import "../Styles/Difficult.css";

const DifficultySelector = ({ currentDifficulty, setDifficulty }) => {
  // Определяем пресеты сложности: название и количество пустых клеток
  const levels = [
    { label: "Easy", value: 2 },
    { label: "Medium", value: 3 },
    { label: "Hard", value: 4 },
    { label: "Expert", value: 5 },
    { label: "Extream", value: 6 },
  ];

  return (
    <div className="difficulty-container">
      <div className="difficulty-buttons">
        <h1 className ="level">Level:</h1>
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

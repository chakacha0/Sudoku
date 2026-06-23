import React from "react";
import { DIFFICULTY_LEVELS } from "../constants/difficultyLevels";
import "../Styles/Difficult.css";

const DifficultySelector = ({ currentDifficulty, setDifficulty }) => {
  return (
    <div className="difficulty-container">
      <div className="difficulty-buttons">
        <h1 className="level">Level:</h1>
        {DIFFICULTY_LEVELS.map((level) => (
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

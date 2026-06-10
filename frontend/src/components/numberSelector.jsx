import React from "react";
import "../Styles/NumberSelector.css";

function NumberSelector({ activeNumber, setActiveNumber }) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="number-selector">
      {numbers.map((num) => (
        <button
          key={num}
          className={`num-btn ${activeNumber === num ? "active" : ""}`}
          // Если нажимаем на уже активную кнопку — снимаем выбор (null)
          onClick={() => setActiveNumber(activeNumber === num ? null : num)}
        >
          {num}
        </button>
      ))}
      <button
        className={`num-btn eraser ${activeNumber === 0 ? "active" : ""}`}
        onClick={() => setActiveNumber(activeNumber === 0 ? null : 0)}
        title="Очистить ячейку"
      >
        🗑️
      </button>
    </div>
  );
}

export default NumberSelector;

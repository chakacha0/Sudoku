import React from "react";
import "../Styles/NumberSelector.css";

// Добавляем remainingNumbers в пропсы.
// Ставим = {}, чтобы если данные не придут, приложение не упало.
function NumberSelector({
  activeNumber,
  setActiveNumber,
  remainingNumbers = {},
}) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="number-selector">
      {numbers.map((num) => {
        // Проверяем, сколько таких цифр осталось
        const count = remainingNumbers[num];
        const isCompleted = count === 0;

        return (
          <button
            key={num}
            // Добавляем класс 'completed', если цифры закончились
            className={`num-btn ${activeNumber === num ? "active" : ""} ${isCompleted ? "completed" : ""}`}
            onClick={() => setActiveNumber(activeNumber === num ? null : num)}
          >
            {num}
            {/* Показываем счетчик, только если он определен */}
            {count !== undefined && (
              <span className="count-badge">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default NumberSelector;

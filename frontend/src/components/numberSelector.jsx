import React from "react";
import "../Styles/NumberSelector.css";


function NumberSelector({
  activeNumber,
  setActiveNumber,
  remainingNumbers,
}) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const counts = remainingNumbers ?? {};

  return (
    <div className="number-selector">
      {numbers.map((num) => {
        const count = counts[num];
        const isCompleted = count === 0;

        return (
          <button
            key={num}
            className={`num-btn ${activeNumber === num ? "active" : ""} ${isCompleted ? "completed" : ""}`}
            onClick={() => setActiveNumber(activeNumber === num ? null : num)}
          >
            {num}
           
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

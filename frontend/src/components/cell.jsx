import { useRef } from "react";

const Cell = ({
  value,
  notes = [],
  isReadOnly,
  isError,
  isSelected,
  isNotesMode,
  activeNumber,
  onChange,
  onClick,
  onNoteToggle,
  onNoteClear,
}) => {
  const cellRef = useRef(null);

  const isActiveDigit =
    activeNumber !== null && activeNumber >= 1 && activeNumber <= 9;

  const isHighlighted = isActiveDigit && value === activeNumber;
  const hasActiveNote = isActiveDigit && notes.includes(activeNumber);

  const handleKeyDown = (e) => {
    if (isReadOnly) return;

    const { key } = e;

    if (isNotesMode && value === 0) {
      if (/^[1-9]$/.test(key)) {
        e.preventDefault();
        onNoteToggle(parseInt(key, 10));
      } else if (key === "Backspace" || key === "Delete" || key === "0") {
        e.preventDefault();
        onNoteClear();
      }
      return;
    }

    if (/^[1-9]$/.test(key)) {
      e.preventDefault();
      onChange(parseInt(key, 10));
    } else if (key === "Backspace" || key === "Delete" || key === "0") {
      e.preventDefault();
      onChange(0);
    }
  };

  const handleClick = () => {
    onClick();
    cellRef.current?.focus();
  };

  return (
    <div
      ref={cellRef}
      className={`sudoku-cell
                ${isReadOnly ? "readonly" : "editable"}
                ${isError ? "error" : ""}
                ${isSelected ? "selected" : ""}
                ${isHighlighted || hasActiveNote ? "highlight-match" : ""}
                ${isNotesMode && !isReadOnly && value === 0 ? "notes-mode" : ""}`}
      tabIndex={isReadOnly ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {value !== 0 ? (
        <span className="cell-value">{value}</span>
      ) : notes.length > 0 ? (
        <div className="cell-notes">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <span
              key={num}
              className={`cell-note ${
                isActiveDigit && notes.includes(num) && num === activeNumber
                  ? "active-note-highlight"
                  : ""
              }`}
            >
              {notes.includes(num) ? num : ""}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Cell;

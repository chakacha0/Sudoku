import { useEffect } from "react";
import { createPortal } from "react-dom";

const ResultModal = ({
  title,
  message,
  errorCount,
  maxErrors,
  buttonText,
  onButtonClick,
  variant = "win",
  score = 0,
}) => {
  useEffect(() => {
    document.body.classList.add("modal-open");

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  return createPortal(
    <div className="win-overlay">
      <div className={`win-modal win-modal--${variant}`}>
        <h2>{title}</h2>
        <p>{message}</p>
        {score !== undefined && (
          <p className="win-modal-score">Очки: {score}</p>
        )}
        {errorCount !== undefined && (
          <p className="win-modal-errors">
            Ошибок: {errorCount}
            {maxErrors !== undefined ? `/${maxErrors}` : ""}
          </p>
        )}
        <button className="new-game-btn" onClick={onButtonClick}>
          {buttonText}
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default ResultModal;

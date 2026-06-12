const ResultModal = ({
  title,
  message,
  errorCount,
  maxErrors,
  buttonText,
  onButtonClick,
  variant = "win",
}) => {
  return (
    <div className="win-overlay">
      <div className={`win-modal win-modal--${variant}`}>
        <h2>{title}</h2>
        <p>{message}</p>
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
    </div>
  );
};

export default ResultModal;

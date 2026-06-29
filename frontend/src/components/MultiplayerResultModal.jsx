import { useEffect } from "react";
import { createPortal } from "react-dom";
import { MAX_MISTAKES } from "../constants/gameConstants";
import { formatMs } from "../utils/timeHelper";

const getStatusLabel = (status) => {
  if (status === "won") return "Решил";
  if (status === "lost") return "Проиграл";
  return "Играет";
};

const MultiplayerResultModal = ({
  variant,
  players = [],
  rankings = [],
  currentPlayerName,
  onContinue,
  onPlayAgain,
}) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  const isFinal = variant === "gameOver";
  const list = isFinal ? rankings : players;

  const title = isFinal
    ? "Игра окончена"
    : variant === "won"
      ? "Поздравляем!"
      : "Игра окончена";

  const message = isFinal
    ? "Результаты игры"
    : variant === "won"
      ? "Вы успешно решили судоку! Остальные игроки ещё соревнуются."
      : `Вы сделали ${MAX_MISTAKES} ошибок и проиграли. Можете следить за остальными.`;

  return createPortal(
    <div className="win-overlay">
      <div
        className={`win-modal multiplayer-result-modal win-modal--${variant === "lost" ? "lose" : "win"}`}
      >
        <h2>{title}</h2>
        <p>{message}</p>

        <ul className="multiplayer-result-modal__list">
          {list.map((player) => {
            const isCurrent =
              currentPlayerName &&
              player.name.trim().toLowerCase() ===
                currentPlayerName.trim().toLowerCase();

            return (
              <li
                key={`${player.name}-${player.place ?? "playing"}`}
                className={`multiplayer-result-modal__item ${isCurrent ? "multiplayer-result-modal__item--current" : ""}`}
              >
                <div className="multiplayer-result-modal__row">
                  {isFinal && player.place != null && (
                    <span className="multiplayer-result-modal__place">
                      #{player.place}
                    </span>
                  )}
                  <span className="multiplayer-result-modal__name">
                    {player.name}
                    {isCurrent ? " (вы)" : ""}
                  </span>
                  <span
                    className={`multiplayer-result-modal__status multiplayer-result-modal__status--${player.status}`}
                  >
                    {getStatusLabel(player.status)}
                  </span>
                </div>
                <div className="multiplayer-result-modal__meta">
                  {player.status === "won" && (
                    <span>Время: {formatMs(player.finishTimeMs)}</span>
                  )}
                  {player.status === "lost" && (
                    <span>Ошибок: {player.mistakeCount}/{MAX_MISTAKES}</span>
                  )}
                  {player.status === "playing" && (
                    <span>
                      Закрыто: {player.filledCells ?? 0} · Ошибок:{" "}
                      {player.mistakeCount ?? 0}
                    </span>
                  )}
                  {isFinal && player.status === "won" && (
                    <span> · Ошибок: {player.mistakeCount ?? 0}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="multiplayer-result-modal__actions">
          {!isFinal ? (
            <button type="button" className="new-game-btn" onClick={onContinue}>
              Следить за игрой
            </button>
          ) : (
            <button type="button" className="new-game-btn" onClick={onPlayAgain}>
              Играть снова
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default MultiplayerResultModal;

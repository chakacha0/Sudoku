import { MAX_MISTAKES } from "../constants/gameConstants";
import { formatMs } from "../utils/timeHelper";

const getStatusLabel = (status) => {
  if (status === "won") return "Победа";
  if (status === "lost") return "Проигрыш";
  return null;
};

const PlayerProgressPanel = ({
  players,
  totalEmptyCells,
  currentPlayerName,
}) => (
  <aside className="multiplayer-players">
    <h3 className="multiplayer-players__title">Игроки</h3>
    <ul className="multiplayer-players__list">
      {players.map((player) => {
        const progress =
          totalEmptyCells > 0
            ? Math.round((player.filledCells / totalEmptyCells) * 100)
            : 0;
        const isCurrent =
          currentPlayerName &&
          player.name.trim().toLowerCase() ===
            currentPlayerName.trim().toLowerCase();
        const statusLabel = getStatusLabel(player.status);
        const isFinished = player.status === "won" || player.status === "lost";

        return (
          <li
            key={player.name}
            className={`multiplayer-players__item ${isCurrent ? "multiplayer-players__item--current" : ""} ${player.status === "won" ? "multiplayer-players__item--won" : ""} ${player.status === "lost" ? "multiplayer-players__item--lost" : ""}`}
          >
            <div className="multiplayer-players__header">
              <span className="multiplayer-players__name">
                {player.place != null && (
                  <span className="multiplayer-players__rank">#{player.place} </span>
                )}
                {player.name}
              </span>
              <div className="multiplayer-players__badges">
                {isCurrent && (
                  <span className="multiplayer-players__badge">вы</span>
                )}
                {statusLabel && (
                  <span
                    className={`multiplayer-players__status multiplayer-players__status--${player.status}`}
                  >
                    {statusLabel}
                  </span>
                )}
              </div>
            </div>

            {!isFinished && (
              <>
                <div className="multiplayer-players__stat">
                  Закрыто: {player.filledCells} / {totalEmptyCells}
                </div>
                <div className="multiplayer-players__bar">
                  <div
                    className="multiplayer-players__bar-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            )}

            {player.status === "won" && (
              <div className="multiplayer-players__stat">
                Время: {formatMs(player.finishTimeMs)}
              </div>
            )}

            <div className="multiplayer-players__stat">
              Ошибки: {player.mistakeCount}/{MAX_MISTAKES}
            </div>
          </li>
        );
      })}
    </ul>
  </aside>
);

export default PlayerProgressPanel;

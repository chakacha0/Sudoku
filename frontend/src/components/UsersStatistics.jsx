import { useState, useEffect } from "react";
import { getLeaderBoard } from "../api/statisticsApi";
import "../Styles/UsersStatistics.css";

const isSameUsername = (a, b) =>
  a && b && a.trim().toLowerCase() === b.trim().toLowerCase();

const Leaderboard = ({ currentUsername }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getLeaderBoard();
        if (!cancelled) {
          setEntries(data);
        }
      } catch {
        if (!cancelled) {
          setError("Не удалось загрузить таблицу лидеров");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="leaderboard-page">
      <div className="leaderboard-card">
        <h2 className="leaderboard-title">Таблица лидеров</h2>
        <p className="leaderboard-subtitle">
          Топ игроков по общему опыту
        </p>

        {loading && (
          <p className="leaderboard-message">Загрузка...</p>
        )}

        {error && <p className="leaderboard-error">{error}</p>}

        {!loading && !error && entries.length === 0 && (
          <p className="leaderboard-message">Пока нет результатов</p>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className="leaderboard-table-wrap">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Место</th>
                  <th>Игрок</th>
                  <th>Уровень</th>
                  <th>Очки</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const isCurrentUser = isSameUsername(
                    currentUsername,
                    entry.username,
                  );

                  return (
                    <tr
                      key={`${entry.rank}-${entry.username}`}
                      className={
                        isCurrentUser ? "leaderboard-row--current" : ""
                      }
                    >
                      <td className="leaderboard-rank">{entry.rank}</td>
                      <td className="leaderboard-player">
                        {isCurrentUser ? (
                          <>
                            <span className="leaderboard-you-badge">Вы</span>
                            {entry.username}
                          </>
                        ) : (
                          entry.username
                        )}
                      </td>
                      <td>{entry.level}</td>
                      <td>{entry.totalXp}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;

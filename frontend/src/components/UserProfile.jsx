import { useState, useEffect } from "react";
import { getUserInfo } from "../api/userApi";
import { DIFFICULTY_LEVELS } from "../constants/difficultyLevels";
import { formatTime } from "../utils/timeHelper";
import "../Styles/UserProfile.css";

const normalizeUserInfo = (data) => {
  const xpInLevel = data.XpInLevel ?? data.xpInLevel ?? 0;
  const xpRequired = data.XpRequired ?? data.xpRequired ?? 0;
  const rawPercent = data.Precent ?? data.precent ?? data.percent;

  const percent =
    rawPercent != null
      ? rawPercent
      : xpRequired > 0
        ? Math.round((xpInLevel / xpRequired) * 1000) / 10
        : 0;

  const rawStats = data.Statistics ?? data.statistics ?? {};
  const statistics = DIFFICULTY_LEVELS.map(({ label, value }) => {
    const entry = rawStats[value] ?? rawStats[String(value)] ?? {};
    return {
      label,
      value,
      count: entry.Count ?? entry.count ?? 0,
      bestTime: entry.BestTime ?? entry.bestTime ?? 0,
    };
  });

  return {
    username: data.Username ?? data.username ?? "",
    email: data.Email ?? data.email ?? "",
    level: data.Level ?? data.level ?? 0,
    xpInLevel,
    xpRequired,
    percent,
    statistics,
  };
};

const UserProfile = ({ onClose, onLogout }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getUserInfo();
        if (!cancelled) {
          setUserInfo(normalizeUserInfo(data));
        }
      } catch {
        if (!cancelled) {
          setError("Не удалось загрузить профиль");
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
    <div className="user-profile-panel">
      <div className="user-profile-header">
        <h3 className="user-profile-title">Аккаунт</h3>
        <button
          type="button"
          className="user-profile-close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
      </div>

      {loading && <p className="user-profile-message">Загрузка...</p>}

      {error && <p className="user-profile-error">{error}</p>}

      {!loading && !error && userInfo && (
        <div className="user-profile-content">
          <div className="user-profile-row">
            <span className="user-profile-label">Имя</span>
            <span className="user-profile-value">{userInfo.username}</span>
          </div>
          <div className="user-profile-row">
            <span className="user-profile-label">Email</span>
            <span className="user-profile-value">{userInfo.email}</span>
          </div>
          <div className="user-profile-level">
            <div className="user-profile-level-header">
              <span className="user-profile-label">Уровень</span>
              <span className="user-profile-level-xp">
                {userInfo.xpInLevel} / {userInfo.xpRequired}
              </span>
            </div>
            <div className="user-profile-level-row">
              <span className="user-profile-level-value">{userInfo.level}</span>
              <div className="user-profile-level-bar">
                <div
                  className="user-profile-level-fill"
                  style={{
                    width: `${Math.min(Math.max(userInfo.percent, 0), 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="user-profile-stats">
            <span className="user-profile-label">Статистика</span>
            <div className="user-profile-stats-table">
              <div className="user-profile-stats-head">
                <span className="user-profile-stats-head-diff" />
                <span>Лучшее время</span>
                <span>Кол-во игр</span>
              </div>
              {userInfo.statistics.map((stat) => (
                <div key={stat.value} className="user-profile-stats-row">
                  <span className="user-profile-stat-label">{stat.label}</span>
                  <span className="user-profile-stat-value">
                    {stat.count > 0 && stat.bestTime > 0
                      ? formatTime(stat.bestTime)
                      : "—"}
                  </span>
                  <span className="user-profile-stat-value">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <button
          type="button"
          className="user-profile-logout"
          onClick={onLogout}
        >
          Выйти
        </button>
      )}
    </div>
  );
};

export default UserProfile;

import axios from "axios";

const API_URL = "http://localhost:5000/api/statistics";

export const normalizeLeaderboard = (data) =>
  (Array.isArray(data) ? data : []).map((item) => ({
    rank: item.Rank ?? item.rank ?? 0,
    username: item.Username ?? item.username ?? "",
    level: item.Level ?? item.level ?? 0,
    totalXp: item.TotalXP ?? item.totalXP ?? item.totalXp ?? 0,
  }));

export const getLeaderBoard = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard`);
    return normalizeLeaderboard(response.data);
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    throw error;
  }
};

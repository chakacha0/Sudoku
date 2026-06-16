import axios from "axios";
import { normalizeUserId } from "../utils/authHelper";

const API_URL = "http://localhost:5000/api/sudoku";

export const getNewGame = async (difficultyValue, userId) => {
  const payload = { difficult: difficultyValue };
  const normalizedUserId = normalizeUserId(userId);

  if (normalizedUserId) {
    payload.userId = normalizedUserId;
  }

  const response = await axios.post(`${API_URL}/new`, payload);
  return response.data;
};
export const validateMove = async (grid, row, col, value) => {
  try {
    const response = await axios.post(`${API_URL}/check-move`, {
      grid,
      row,
      col,
      value,
    });
    return response.data.isValid;
  } catch (error) {
    console.error("Ошибка при валидации:", error);
    return true;
  }
};

export const getSolution = async (board) => {
  const response = await axios.post(`${API_URL}/get-solution`, {
    board: board,
  });

  return response.data;
};

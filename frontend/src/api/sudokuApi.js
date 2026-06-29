import axios from "axios";
import api from "./apiClient";

const API_URL = "http://localhost:5000/api/sudoku";

export const getNewGame = async (difficultyValue) => {
  const response = await api.post("/sudoku/new", { difficult: difficultyValue });
  return response.data;
};

export const validateMove = async (row, col, board, time) => {
  const response = await api.post("/sudoku/check-move", {
    row,
    col,
    board,
    time,
  });
  return response.data;
};

export const getSolution = async (board) => {
  const response = await axios.post(`${API_URL}/get-solution`, { board });
  return response.data;
};

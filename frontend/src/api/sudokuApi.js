import axios from "axios";

const API_URL = "http://localhost:5183/api/sudoku"; // Проверь свой порт!

export const getNewGame = async (difficultyValue) => {
  const response = await axios.get(`${API_URL}/new`, {
    params: {
      difficult: difficultyValue, // ключ должен точно совпадать с именем аргумента в C#
    },
  });
  return response.data.cells;
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
    return true; // В случае ошибки не будем пугать пользователя красным цветом
  }
};

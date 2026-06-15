import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; 

/**
 * Регистрация нового пользователя
 * @param {string} username 
 * @param {string} email 
 * @param {string} password 
 */
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
    });
    return {
      token: response.data.Token ?? response.data.token,
    };
  } catch (error) {
    throw error.response?.data ?? new Error("Ошибка сети");
  }
};

/**
 * Авторизация пользователя
 * @param {string} email 
 * @param {string} password 
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return {
      token: response.data.Token ?? response.data.token,
    };
  } catch (error) {
    throw error.response?.data ?? new Error("Ошибка сети");
  }
};
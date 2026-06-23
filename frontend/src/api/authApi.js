import api from "./apiClient";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  // Важно: твой бэкенд должен возвращать объект с двумя полями
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
};

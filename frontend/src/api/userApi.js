import api from "./apiClient";

export const getUserInfo = async () => {
  const response = await api.get("/user/user-info");
  return response.data;
};

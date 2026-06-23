import axios from "axios";
import {
  clearAuthSession,
  normalizeAuthResponse,
  saveAuthSession,
} from "../utils/authHelper";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

let refreshPromise = null;

const isAuthRequest = (url = "") =>
  url.includes("/auth/login") ||
  url.includes("/auth/register") ||
  url.includes("/auth/refresh");

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("Refresh token not found");
      }

      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken,
      });

      saveAuthSession(response.data);
      return normalizeAuthResponse(response.data).accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

const handleSessionExpired = () => {
  clearAuthSession();
  window.dispatchEvent(new CustomEvent("auth:session-expired"));
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      !originalRequest ||
      originalRequest._retry ||
      isAuthRequest(originalRequest.url) ||
      error.response?.status !== 401
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      handleSessionExpired();
      return Promise.reject(refreshError);
    }
  },
);

export default api;

import { useState, useEffect } from "react";
import { refreshAccessToken } from "../api/apiClient";
import {
  getAccessToken,
  getRefreshToken,
  getUsernameFromToken,
  isAuthenticated,
  isTokenExpired,
  logout,
  migrateLegacyToken,
} from "../utils/authHelper";

export const useAuth = () => {
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || "",
  );
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    migrateLegacyToken();

    const initAuth = async () => {
      const storedUsername = localStorage.getItem("username") || "";
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken && !refreshToken) {
        if (storedUsername) {
          logout();
        }
        setUsername("");
        return;
      }

      if (accessToken && !isTokenExpired(accessToken)) {
        const name = getUsernameFromToken(accessToken) || storedUsername;
        setUsername(name);
        if (name) {
          localStorage.setItem("username", name);
        }
        return;
      }

      if (refreshToken) {
        try {
          await refreshAccessToken();
          const newToken = getAccessToken();
          const name = getUsernameFromToken(newToken) || storedUsername;
          setUsername(name);
          if (name) {
            localStorage.setItem("username", name);
          }
        } catch {
          logout();
          setUsername("");
        }
        return;
      }

      logout();
      setUsername("");
    };

    initAuth();
  }, []);

  useEffect(() => {
    const onSessionExpired = () => {
      logout();
      setUsername("");
      setIsProfileOpen(false);
    };

    window.addEventListener("auth:session-expired", onSessionExpired);
    return () =>
      window.removeEventListener("auth:session-expired", onSessionExpired);
  }, []);

  const handleUserClick = () => {
    if (isAuthenticated() && username) {
      setIsProfileOpen((prev) => !prev);
      return;
    }

    if (username) {
      logout();
      setUsername("");
    }

    setIsProfileOpen(false);
    setIsAuthOpen(true);
  };

  const handleLogout = (onLogoutExtra) => {
    logout();
    setUsername("");
    setIsProfileOpen(false);
    onLogoutExtra?.();
  };

  const handleAuthSuccess = (name) => {
    setUsername(name);
    setIsAuthOpen(false);
  };

  const isLoggedIn = Boolean(username) && isAuthenticated();

  return {
    username,
    isLoggedIn,
    isAuthOpen,
    isProfileOpen,
    setIsAuthOpen,
    setIsProfileOpen,
    handleUserClick,
    handleLogout,
    handleAuthSuccess,
  };
};

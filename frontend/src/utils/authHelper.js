export const getErrorMessage = (error, fallback = "Произошла ошибка") => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  return error.Message || error.message || fallback;
};

export const normalizeAuthResponse = (data) => ({
  accessToken:
    data?.accessToken ??
    data?.AccessToken ??
    data?.token ??
    data?.Token ??
    "",
  refreshToken: data?.refreshToken ?? data?.RefreshToken ?? "",
});

export const getAccessToken = () =>
  localStorage.getItem("accessToken") || localStorage.getItem("token") || "";

export const getRefreshToken = () => localStorage.getItem("refreshToken") || "";

export const getUsernameFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.username || "";
  } catch {
    return "";
  }
};

export const getUserIdFromToken = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.sub || payload.id || null;
    return userId && userId !== "00000000-0000-0000-0000-000000000000"
      ? userId
      : null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token, skewSeconds = 30) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now() + skewSeconds * 1000;
  } catch {
    return true;
  }
};

const isValidGuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );

export const normalizeUserId = (userId) =>
  userId && isValidGuid(userId) ? userId : null;

export const saveAuthSession = (data, usernameFallback = "") => {
  const { accessToken, refreshToken } = normalizeAuthResponse(data);

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  localStorage.removeItem("token");

  const name =
    getUsernameFromToken(accessToken) || usernameFallback.trim() || "";
  if (name) {
    localStorage.setItem("username", name);
  }

  return name;
};

export const clearAuthSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  localStorage.removeItem("username");
};

export const logout = () => {
  clearAuthSession();
  localStorage.removeItem("total_score");
};

export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (accessToken && !isTokenExpired(accessToken)) {
    return true;
  }

  return Boolean(refreshToken);
};

export const migrateLegacyToken = () => {
  const legacyToken = localStorage.getItem("token");
  if (legacyToken && !localStorage.getItem("accessToken")) {
    localStorage.setItem("accessToken", legacyToken);
    localStorage.removeItem("token");
  }
};

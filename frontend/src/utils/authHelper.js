export const getErrorMessage = (error, fallback = "Произошла ошибка") => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  return error.Message || error.message || fallback;
};

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

const isValidGuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );

export const normalizeUserId = (userId) =>
  userId && isValidGuid(userId) ? userId : null;

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

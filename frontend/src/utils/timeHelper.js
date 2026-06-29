export const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const formatMs = (ms) => {
  if (ms == null || ms < 0) return "—";
  return formatTime(Math.floor(ms / 1000));
};

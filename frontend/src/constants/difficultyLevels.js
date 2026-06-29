export const DIFFICULTY_LEVELS = [
  { label: "Easy", value: 1 },
  { label: "Medium", value: 2 },
  { label: "Hard", value: 3 },
  { label: "Expert", value: 4 },
  { label: "Extream", value: 5 },
];

export const getDifficultyLabel = (value) =>
  DIFFICULTY_LEVELS.find((level) => level.value === value)?.label ?? "Medium";

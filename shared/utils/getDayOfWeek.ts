export const getDayOfWeek = (date?: string | null) => {
  if (!date) return "No day";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "Invalid day";

  return d.toLocaleDateString("en-US", {
    weekday: "long",
  });
};
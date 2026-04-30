export const formatDate = (date?: string | null) => {
  if (!date) return "No date";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "Invalid date";

  return d.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

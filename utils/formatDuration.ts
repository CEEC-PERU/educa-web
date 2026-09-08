export const formatDuration = (seconds: number): string => {
  if (!seconds || seconds < 60) {
    return "< 1m";
  }

  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
};

export const formatClockDuration = (totalSeconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const formatRelativeTime = (date: string | Date): string => {
  const target = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - target.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 60) {
    return "hace unos minutos";
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
  }

  return target.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

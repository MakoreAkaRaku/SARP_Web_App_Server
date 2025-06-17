export function getTextFromLastSeen(lastSeen: Date | null): string {
  if (!lastSeen) return "Nunca" as const;
  const now = new Date();
  const diff = now.getTime() - new Date(lastSeen).getTime();
  if (diff < 0) return "Viajó al futuro" as const;
  //Calculus for time difference
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / (60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 365) return "Hace más de un año" as const;
  if (days > 30) return "Hace más de un mes" as const;
  if (days > 0) return `Hace ${days} días` as const;
  if (hours > 0) return `Hace ${hours} horas` as const;
  if (2 <= minutes && minutes < 60) return `Hace ${minutes} minutos` as const;
  if (minutes === 1) return "Hace un minuto";
  if (2 <= seconds && seconds < 60) return `Hace ${seconds} segundos` as const;
  if (seconds === 1) return "Hace un segundo" as const;
  return "Ahora mismo" as const;
}
import { Html } from "@elysiajs/html"

interface ModuleStatusProps {
  classes?: string
  lastSeen: Date | null
}

export default function ModuleStatus({ lastSeen, classes }: ModuleStatusProps) {
  const statusColor = getColorStatusFromLastSeen(lastSeen)

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={statusColor} stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class ={classes}>
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path>
    </svg>
  )
}


function getColorStatusFromLastSeen(lastSeen: Date | null): string {
  if (!lastSeen) return "#FF0000" as const; // Red if never seen
  const now = new Date();
  const diff = now.getTime() - new Date(lastSeen).getTime();
  if (diff < 0) return "#000000" as const; // White if traveled to the future
  // Calculus for time difference
  const seconds = Math.floor(diff / 1000);

  switch (true) {
    case seconds < 60*5:
      return "#00FF00" as const; // Green if less than 5 minute
    case seconds < 3600:
      return "#FFFF00" as const; // Yellow if less than an hour
    case seconds < 86400:
      return "#FFA500" as const; // Orange if less than a day
    case seconds < 31536000:
      return "#FF0000" as const; // Red if less than a year
  }
  return "#00FF00" as const; // Green if now
}
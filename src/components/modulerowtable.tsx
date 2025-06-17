import { Html } from "@elysiajs/html"
import ModuleStatus from "./modulestatus";
import { min } from "drizzle-orm";

type ModuleElementProps = {
  properties: {
    alias: string;
    uuid: string;
    last_seen: Date | null;
    token_api: string;
  };
}

export function ModuleRow({ properties }: ModuleElementProps) {
  const timeText = getTextFromLastSeen(properties.last_seen);
  return (
    <tr class="border-b border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer">
      <td class="border-r border-gray-700 py-2" align="center">{properties.alias}</td>
      <td class="border-r border-gray-700 py-2" align="center">
        <a class="font-mono text-green-500 hover:text-white hover:underline" href={"/modules/" + properties.uuid}>{properties.uuid}</a>
      </td>
      <td class="border-r border-gray-700 py-2" align="center">
        <p class="font-mono">{properties.token_api}</p>
      </td>
      <td class="border-gray-700 flex flex-row items-center justify-center gap-3 py-2" align="center">
        <ModuleStatus lastSeen={properties.last_seen} />
        <p class="align-middle">{timeText}</p>
      </td>
    </tr>)
}

function getTextFromLastSeen(lastSeen: Date | null): string {
  if (!lastSeen) return "Nunca visto" as const;
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
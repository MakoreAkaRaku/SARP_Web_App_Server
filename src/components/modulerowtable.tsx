import { Html } from "@elysiajs/html"
import ModuleStatus from "./modulestatus";
import { min } from "drizzle-orm";
import { getTextFromLastSeen } from "../utils";

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
import { Html } from "@elysiajs/html"
import type { Group } from "../data/group";
import { GroupRow } from "./grouprowtable";

interface GroupTableProperties {
  groups: Group[]
}

export default function GroupTable({ groups }: GroupTableProperties) {
  return (
    <div class="flex flex-col gap-4" x-data="{ open: Ftrue }">
      <table
        class="rounded-lg border-collapse table-auto md:table-fixed md:w-auto w-full"
      >
        <thead class="bg-gray-800 text-lg">
          <tr>
            <th>Nombre del Grupo</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((props) => (
            <GroupRow properties={props} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
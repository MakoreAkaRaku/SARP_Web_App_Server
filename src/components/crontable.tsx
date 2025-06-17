import { Html } from "@elysiajs/html"
import type { ScheduleSelect } from "../data/schedule";
import { CronRow } from "./cronrow";
import { EmptyIcon } from "../pages/resources/resources";

export interface CronTableListProps {
  schedules: ScheduleSelect[]
};

export default function CronTable({ schedules }: CronTableListProps) {
  if (schedules.length === 0) {
    return (
      <div class="flex flex-col p-4 items-center justify-center gap-4">
        <EmptyIcon fill="#32844C" classes="size-56" />
        <p>No tienes schedules (aún)</p>
      </div>
    )
  }
  return (
    <table
      class="rounded-lg border-collapse table-auto md:table-fixed w-full">
      <thead class="bg-gray-800 text-lg">
        <tr>
          <th>Nombre</th>
          <th>Expresión 'Cron'</th>
          <th>Ultima vez que se activó</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {schedules.map((props) => (
          <CronRow {...props} />
        ))}
      </tbody>
    </table>
  );
}
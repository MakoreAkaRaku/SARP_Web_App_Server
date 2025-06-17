import { getTextFromLastSeen } from "../utils"
import { Html } from "@elysiajs/html"
import Form from "./form";
import Button from "./button";
import { IconDelete, IconSave } from "../pages/resources/resources";
import type { Schedule } from "../data/schedule";
import Input from "./input";

interface CronElementProps extends Schedule {
}


export function CronRow(properties: CronElementProps) {
  const timeText = getTextFromLastSeen(properties.last_run!);
  return (
    <tr class="border-b border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer">
      <td class="border-r border-gray-700 py-2" align="center">
        <Form
          classes="flex flex-row gap-2 w-full"
          url={"/scheduler/update/" + properties.id}
          formActions={
            <Button>
              <IconSave classes="size-6" />
            </Button>
          }
          method="POST"
        >
          <Input 
          classInput="w-full bg-inherit border-b-2 w-96 p-2 outline-none focus:text-xl focus:border-green-500/60 border-green-800/60"
          classContainer="w-full" 
          name="name" 
          type="text" 
          value={properties.name} />
        </Form>
      </td>
      <td class="border-r border-gray-700 py-2" align="center">
        <p class="font-mono">{properties.cron_expression}</p>
      </td>
      <td class="border-r border-gray-700  py-2" align="center">
        <p class="align-middle">{timeText}</p>
      </td>
      <td>
        <Form
          classes="flex flex-row w-full justify-center items-center"
          method="POST"
          url={"/scheduler/delete/" + properties.id}
          formActions={
            <button class="rounded-md bg-red-700 hover:bg-red-500 p-2" type="submit">
              <div class="flex flex-row gap-2">
                <IconDelete classes="size-7"  stroke="white"/>
                <p class="text-fit">Borrar</p>
              </div>
            </button>
          }
        >
        </Form>
      </td>
    </tr>)
}
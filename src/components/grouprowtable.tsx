import { Html } from "@elysiajs/html"
import ModuleStatus from "./modulestatus";
import { min } from "drizzle-orm";
import type { Group } from "../data/group";
import Form from "./form";
import Input from "./input";
import Button from "./button";
import { IconSave } from "../pages/resources/resources";

type GroupElementProps = {
  properties: Group
}

export function GroupRow({ properties }: GroupElementProps) {
  const fieldClass = 'bg-inherit border-b-2 w-96 p-2 outline-none focus:text-xl focus:border-green-500/60 border-green-800/60'
  return (
    <tr class="border-b border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer">
      <td class=" border-gray-700 py-2" align="center">
        <Form
          classes="flex flex-row items-center justify-between"
          method="POST"
          url={"/groups/" + properties.id}
          formActions={
            <Button type="submit">
              <IconSave classes="size-6"></IconSave>
            </Button>
          }
        >
          <Input
            classContainer="w-96"
            classInput={fieldClass}
            name="group_name"
            type="text"
            value={properties.group_name}
          />
        </Form>
      </td>
    </tr>)
}
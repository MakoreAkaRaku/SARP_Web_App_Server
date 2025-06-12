import { Html } from "@elysiajs/html"
import type { Peripheral } from "../data/peripheral"
import Form from "./form"
import Input from "./input"
import { IconCalendar, IconChartPie, IconDashboard, IconSave } from "../pages/resources/resources"
import Button from "./button"
import type { Module } from "../data/module"

interface PeripheralProps {
  data: Peripheral
  module: Module
}

export default function PeripheralListElement({ module, data }: PeripheralProps) {
  return (
    <div class="flex flex-col w-96 h-52 bg-gray-800/70 rounded-lg shadow-xl p-4 gap-4">
      <div class="flex flex-row gap-2 justify-between">
        <h2>{data.peripheral_type}</h2>
        <div class="flex flex-row gap-2">
          <a class="size-10 rounded-full hover:bg-gray-800" href={"/dashboard/" + data.id}>
            <IconChartPie stroke="rgb(255,255,255)" fill="none" />
          </a>
          <a class="size-10 rounded-full hover:bg-gray-800" href={"/dashboard/" + data.id}>
            <IconCalendar fill="rgb(255,255,255)" />
          </a>
        </div>
      </div>
      <Form url={"/peripheral/"+module.uuid} method="POST" classes="flex text-justify text-pretty w-full h-full flex-row items-center justify-center gap-2">
        <Input name="id" type="hidden" value={data.id.toString()} />
        <Input type="textarea" classInput="field-sizing-content resize-none bg-inherit w-full h-full bg-gray-800/70 border-b-2 p-2 outline-none focus:border-green-500/60 border-green-800/60"
          classContainer="flex h-full w-full flex-row items-center justify-center"
          required
          name="short_descr"
          value={data.short_descr ? data.short_descr : "Sin descripción"}
        />
        <Button type="submit" >
          <IconSave classes="size-6" />
        </Button>
      </Form>
    </div>
  )
}
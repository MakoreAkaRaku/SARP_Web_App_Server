import { Html } from "@elysiajs/html"
import type { Peripheral } from "../data/peripheral"
import { EmptyIcon } from "../pages/resources/resources"
import PeripheralListElement from "./peripheralListElement"
import type { Module } from "../data/module"


interface PeripheralProps {
  peripheralList: Peripheral[]
  module: Module
}

export default function Peripherals({ module,peripheralList }: PeripheralProps) {
  if (peripheralList.length === 0) {
    return (
      <div class="flex flex-col p-4 items-center justify-center gap-4">
        <EmptyIcon fill="#32844C" classes="size-56" />
        <p>No hay periféricos disponibles. Revisa si el módulo ha podido registrar los periféricos de manera automática.</p>
        <p>Si el problema persiste, contacta con un administrador del sistema.</p>
        <a class="text-green-600 hover:text-white hover:borderline" href="/about">Saber más</a>
      </div>
    )
  }
  return (
    <div class="flex flex-wrap p-4 items-left justify-center gap-4">
      {peripheralList.map((peripheral) => (
        <PeripheralListElement module={module} data={peripheral}/>
      ))}
    </div>)
}
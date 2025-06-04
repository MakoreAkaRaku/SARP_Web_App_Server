import { Html } from "@elysiajs/html"
import type { Peripheral } from "../data/peripheral"


interface PeripheralProps {
  peripheralList: Peripheral[]
}

export default function Peripherals({ peripheralList }: PeripheralProps) {
  return (<>
    <h1>Periféricos</h1>
    <div class="flex flex-col p-4 items-left justify-center gap-4">

      <p>Peripherals are not implemented yet.</p>
    </div>
  </>
  )
}
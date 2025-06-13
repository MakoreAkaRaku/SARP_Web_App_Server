import { Html } from '@elysiajs/html'
import type { Peripheral } from '../data/peripheral'

interface PeripheralChartProps {
  PeripheralData: Peripheral[]
  scriptSrc: string,
  divClass?: string,
  canvasClass?: string,
  id:string
}

export default function LineChart({scriptSrc,divClass,canvasClass, id="linechart"}: PeripheralChartProps) {

  return (<>
    <div class={divClass}>
      <canvas id={id} class={canvasClass}></canvas>
    </div>
    <script type="module" src={scriptSrc}/>
  </>)
}
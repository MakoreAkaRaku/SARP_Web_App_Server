import { Html } from '@elysiajs/html'
import type { DataProps } from '../pages/dashboard'

interface PeripheralChartProps {
  hasRangeDate: boolean,
  scriptSrc: string,
  divClass?: string,
  canvasClass?: string,
  canvasId: string
  chartData: ChartProps,
  peripheralId: number | undefined
}


interface ChartProps {
  chartName: String,
  labels: Array<string>,
  values: Array<unknown>
}

/**
 * 
 */
export default function LineChart({
  hasRangeDate,
  peripheralId,
  chartData,
  scriptSrc,
  divClass,
  canvasClass,
  canvasId = "linechart"
}: PeripheralChartProps) {
  hasRangeDate = false
  console.log(chartData)
  return (<>
    <div
      x-data={!hasRangeDate && `{ 
        intervalHandle: undefined,
        startDrawing() {
          const chart = createLineChart({
            element: document.getElementById('${canvasId}'),
            dataset: ${JSON.stringify(chartData)}
          })
          this.intervalHandle = setInterval(() => this.update(chart), 5000)
        },
        async update(chart) {
            const endDate = new Date()
            const end = endDate.toISOString()
            const begin = new Date(endDate.getTime() - 5000).toISOString()
            // 1. get the data with fetch

            const endpoint = '/api/peripheral/${peripheralId}?begin='+begin+'&end='+end
            const response = await fetch(endpoint);
            if(response.ok == false) {
              return
            }
            const data = await response.json()
            if(data.data.values.length == 0 ){
            console.log(data)
              return
            }
            // 2. Removing old datapoint
            
            chart.data.labels.shift()
            chart.data.datasets[0].data.shift()

            // 3. Adding new datapoint.
            chart.data.datasets[0].data.push(data.data.values[0])
            const labelDate = new Date(data.data.dates[0])
            const label = labelDate.toLocaleTimeString() + " " + labelDate.toLocaleDateString()
            console.log(label)
            chart.data.labels.push(label)
            
            // 4. chart.update()
            chart.update()
        }
      }`}
      x-init={!hasRangeDate && `$nextTick(() => startDrawing())`}
      class={divClass}>
      <canvas id={canvasId} class={canvasClass}></canvas>
    </div>
    <script type="module" src={scriptSrc} />
  </>)
}
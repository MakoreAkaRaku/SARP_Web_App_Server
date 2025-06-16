import { Html } from "@elysiajs/html"
import BaseLayout, { type BaseLayoutProps } from "../components/baselayout"
import LineChart from "../components/linechart"
import type { Peripheral } from "../data/peripheral"

interface DashboardProps extends BaseLayoutProps {
  peripheral: Peripheral | undefined,
  range: {
    begin?: Date | undefined,
    end?: Date | undefined,
  }
  data: DataProps
}

export interface DataProps {
  dates: Array<Date>,
  values: Array<unknown>
}

export default function Dashboard({ peripheral, range, data, userCredentials }: DashboardProps) {

  const chartProps = {
    chartName: "Datos del periférico ",
    labels: data.dates.map((date) => {
      return date.toLocaleTimeString() + " " + date.toLocaleDateString()
    }),
    values: data.values

  }

  return (
    <BaseLayout {...{ userCredentials }}>
      <div class="flex flex-col p-4 items-left justify-center gap-4">
        <h1>Periférico tipo '{peripheral?.p_type}'</h1>
        <p class="italic">{peripheral?.short_descr}</p>
        <div class="flex flex-row gap-4">
          <p class="font-bold">Módulo:</p>
          <a href={"/modules/" + peripheral?.parent_module} class="font-mono text-green-600 hover:text-white">{peripheral?.parent_module}</a>
        </div>
        <div class="flex flex-col items-center gap-2 w-full">
        <LineChart
          hasRangeDate={true || range.begin !== undefined && range.end !== undefined}
          chartData={chartProps}
          peripheralId={peripheral?.id}
          divClass="relative w-[60rem] shadow-xl" canvasId="linechart" scriptSrc="/linechart.js" />
          <p>Here goes the form</p>
        </div>

      </div>
    </BaseLayout>
  )
}
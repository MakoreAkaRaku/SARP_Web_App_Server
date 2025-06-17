import { Html } from "@elysiajs/html"
import BaseLayout, { type BaseLayoutProps } from "../components/baselayout"
import LineChart from "../components/linechart"
import type { Peripheral } from "../data/peripheral"
import Form from "../components/form"
import Button from "../components/button"
import Input from "../components/input"
import { formatDate } from "date-fns"

interface DashboardProps extends BaseLayoutProps {
  peripheral: Peripheral | undefined,
  range: {
    begin?: Date | undefined,
    end?: Date | undefined,
  }
  data: DataProps,
}

export interface DataProps {
  dates: Array<Date>,
  values: Array<unknown>
}

export default function Dashboard({ peripheral, range, data, userCredentials, }: DashboardProps) {

  if (range.begin === undefined || range.end === undefined) {
    range.end = new Date()
    range.begin = new Date(range.end.getTime() - 30000 * 60) //30 minutes before
  }

  const text= new Date(formatDate(range.end, "yyyy-MM-dd HH:mm").replace(' ', 'T')).toISOString()
  const beginText = formatDate(range.begin, "yyyy-MM-dd HH:mm").replace(' ', 'T')
  const endText = formatDate(range.end, "yyyy-MM-dd HH:mm").replace(' ', 'T')

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
          <Form
            classes="flex flex-row gap-4 items-center justify-center"
            method="GET"
            url={"/dashboard/" + peripheral?.id}
            formActions={
              <Button>
                Observar
              </Button>
            }
          >
            <Input
              classLabel="font-bold"
              label="Desde"
              classContainer="flex flex-row gap-2 items-center justify-center"
              name="begin"
              value={beginText}
              type="datetime-local"
            />
            <Input
              classLabel="font-bold"
              label="Hasta"
              classContainer="flex flex-row gap-2 items-center justify-center"
              name="end"
              value={endText}
              type="datetime-local"
            />
          </Form>
          <a href={"/dashboard/"+peripheral?.id}><Button type="reset">Ver en tiempo real</Button></a>
        </div>
      </div>
    </BaseLayout>
  )
}

//TODO: format Date() in order to make it into datetime-local format. Also, you should also send the timezone since it's going to be a pain in the ass.... rethink the queries
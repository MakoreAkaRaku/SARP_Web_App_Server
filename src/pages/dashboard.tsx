import {Html} from "@elysiajs/html"
import BaseLayout from "../components/baselayout"
import LineChart from "../components/linechart"

interface DashboardProps {
}

export default function Dashboard({}: DashboardProps) {
  return (<BaseLayout>
  <h1>Gráfico de tiempos</h1>
  <LineChart PeripheralData={[]} divClass="w-1/2" id="linechart" scriptSrc="/linechart.js"/>
    </BaseLayout>)
}
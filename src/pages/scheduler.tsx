import { Html } from "@elysiajs/html"
import BaseLayout, { type BaseLayoutProps } from "../components/baselayout"
import Form from "../components/form"
import Button from "../components/button"
import CronTable, { type CronTableListProps } from "../components/crontable"
import Input from "../components/input"

interface SchedulerProps extends BaseLayoutProps {
  peripheral: {
    id: number,
    p_type: string,
  }
}

export default function Scheduler({ userCredentials, peripheral, schedules }: SchedulerProps & CronTableListProps) {
  return (
    <BaseLayout {...{ userCredentials }}>
      <div class="flex flex-col p-4 items-left justify-center gap-4">
        <h1>Schedules de mi periférico '{peripheral.p_type}'</h1>
        <div class="flex flex-col items-center gap-2 w-full">
          <CronTable schedules={schedules} />
          <Form
            classes="flex flex-row gap-4 items-center justify-center w-full"
            method="POST"
            url={"/scheduler/" + peripheral.id}
            formActions={
              <Button type="submit">
                Añadir Schedule
              </Button>
            }
          >
            <Input
              required
              classContainer="w-full"
              type="text"
              name="name"
              label="Nombre del Schedule"
            />
            <cron-input-ui name="cron_expression" class="text-black" color="#258242" required hot-validate value="* * * * *" />

          </Form>
        </div>
      </div>
    </BaseLayout>
  )
}
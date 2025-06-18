import Elysia from "elysia"
import cron from "@elysiajs/cron"
import { getSchedules, shouldRunNow, updateSchedule } from "../data/schedule"
import { getPeripheralState, getPeripheralStatesFromStateOn, updatePeripheralState } from "../data/peripheral"

export const cronApp = new Elysia()
  .use(
    cron
      ({
        name: 'CronExecutor',
        pattern: '*/1 * * * *',
        async run() {
          //1. Retrieve all peripheralStates that are on
          const peripheralStates = await getPeripheralStatesFromStateOn()
          if (!peripheralStates.valid) {
            console.error("Error in CronExecutor: ", peripheralStates.body)
          }
          //2. Update all peripherals ticks and set to 'off' the ones already arrived at maximum tick count.
          const updatedPeripheralsState = peripheralStates.body.map((pState) => {
            if (pState.ticked_time === pState.ticks_to_stop) {
              pState.ticked_time = 0
              pState.state = 'off'
            }
            else {
              pState.ticked_time += 1
            }
            pState.last_modified = new Date()
            updatePeripheralState(pState) //Send updates for each peripheral state.
            return pState
          })
          //3. Retrieve all schedules.
          const schedules = await getSchedules()
          const date = new Date()
          if (!schedules.valid) {
            console.error("Error in CronExecutor: ", schedules.message)
            return
          }
          console.log('Heartbeat of 1 minute')
          //4. Check all Schedules; 
          // If null, put them a last_run, do not activate it since it's the first time the cron detects it
          // In any other case distinct from null and able to run, change the state to 'on', and after that,
          //Update the schedule last run 
          schedules.body.map(
            async (schedule) => {
              if (schedule.last_run == null) {
                schedule.last_run = new Date()
                updateSchedule(schedule)
                return
              }
              else if (schedule.last_run != null &&
                shouldRunNow(schedule.cron_expression, schedule.last_run)) {
                const peripheralState = await getPeripheralState(schedule.peripheral_id)
                if (!peripheralState.valid) {
                  console.error("Error in CronExecutor: ", peripheralState.body)
                  return
                }
                peripheralState.body.state = 'on'
                peripheralState.body.last_modified = new Date()
                updatePeripheralState(peripheralState.body)
                schedule.last_run = peripheralState.body.last_modified
                updateSchedule(schedule)
              }

            }
          )
        }
      }
      )
  )

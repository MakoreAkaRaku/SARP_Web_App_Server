import { tr } from "date-fns/locale"
import { shouldRunNow } from "./schedule"
import { test, expect, setSystemTime } from "bun:test"

test("Schedule Cron Job works well each 1 second", async () => {
  const expression = "*/1 * * * * *"
  setSystemTime(0)
  let lastRun = new Date()
  let result = shouldRunNow(expression, lastRun)
  expect(result).toBe(false)
  setSystemTime(1010)
  result = shouldRunNow(expression,lastRun)
  expect(result).toBe(true)
  lastRun = new Date()
  result = shouldRunNow(expression,lastRun)
  expect(result).toBe(false)
  setSystemTime(2005)
  result = shouldRunNow(expression,lastRun)
  expect(result).toBe(true)
})

test("Schedule Cron Job works well each 2 second", async () => {
  const expression = "*/2 * * * * *"
  setSystemTime(0)
  let lastRun = new Date()
  let result = shouldRunNow(expression,lastRun)
  expect(result).toBe(false)
  setSystemTime(2010)
  result = shouldRunNow(expression,lastRun)
  expect(result).toBe(true)
  lastRun = new Date()
  setSystemTime(2500)
  result = shouldRunNow(expression,lastRun)
  expect(result).toBe(false)
  
})
import {Html } from "@elysiajs/html"

export interface BaseFormProps {
  url: string,
  headerText: string,
  method: 'POST' | 'GET',
  classes?: string,
  children?: any,
  formActions?: any
}

export default function Form({ url, method, classes, children, formActions }: BaseFormProps) {
  return (
    <form method={method} action={url} class={"max-w-lg mx-auto "+classes}>
      {children}
      <div class="flex flex-row gap-x-2">
        {formActions}
      </div>
    </form>
  )
}
import { Html } from "@elysiajs/html"
import BaseLayout, { type BaseLayoutProps } from "../components/baselayout"
import Button from "../components/button"
import Form from "../components/form"
import { EmptyIcon } from "./resources/resources"
import type { Group } from "../data/group"
import Input from "../components/input"
import GroupTable from "../components/grouptable"

interface GroupLayoutProps extends BaseLayoutProps {
  groups: Group[]
}
export default function Groups({ groups, userCredentials }: GroupLayoutProps) {
  var content: JSX.Element

  if (groups != undefined && groups.length > 0) {
    content = <GroupTable groups={groups} />
  }
  else {
    content = <div class="self-center flex flex-col gap-4">
      <EmptyIcon fill="#ffffff" classes="size-96 self-center" />
      <p class="text-lg text-center">
        Sin Grupos (aún).
      </p>
    </div>
  }
  return (<BaseLayout title="Grupos" {...{ userCredentials }}>
    <div class="flex flex-col p-4 items-left justify-center gap-4">
      <h1>Mis Grupos</h1>
      {content}
      <Form method="POST" url="/groups"
      classes="flex flex-row gap-4"
        formActions={
          <Button type="submit" >
            Añadir grupo
          </Button>}>
        <Input
        classContainer="flex flex-row items-center justify-center w-96"
          classLabel="w-52 font-bold text-center align-text-center"
          label="Nuevo grupo"
          type="text"
          name="group_name"
          required
        />
      </Form>
    </div>
  </BaseLayout>)
}
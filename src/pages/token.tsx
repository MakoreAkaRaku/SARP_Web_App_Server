import BaseLayout, { type BaseLayoutProps } from "../components/baselayout";
import { Html } from "@elysiajs/html";
import { EmptyIcon } from "./resources/resources";
import type { Token } from "../data/apitoken";
import Form from "../components/form";
import Button from "../components/button";
import TokenTable from "../components/tokentable";

export interface ModuleLayoutProps extends BaseLayoutProps {
  tokens: Token[]
}

export default function Tokens({ tokens, userCredentials }: ModuleLayoutProps) {
  var content: JSX.Element

  if (tokens != undefined && tokens.length > 0) {
    content = <TokenTable tokenList={tokens} />
  }
  else {
    content = <div class="self-center flex flex-col gap-4">
      <EmptyIcon fill="#ffffff" classes="size-96 self-center" />
      <p class="text-lg text-center">
        Sin Tokens (aún).
      </p>
    </div>
  }
  return (<BaseLayout title="Token" {...{ userCredentials }}>
    <div class="flex flex-col p-4 items-left justify-center gap-4">
      <h1>Mis Token</h1>
      {content}
      <Form method="POST" url="/token" formActions={
        <Button type="submit" class="ml-auto">
          Generar Token Aleatorio
        </Button>} />
    </div>
  </BaseLayout>)
}
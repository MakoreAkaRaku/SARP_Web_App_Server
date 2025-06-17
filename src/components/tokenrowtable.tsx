import { Html } from "@elysiajs/html";
import type { Token } from "../data/apitoken";

type TokenElementProps = {
  properties: Token
}

export function TokenRow({ properties }: TokenElementProps) {
  return (
    <tr class="border-b border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer">
      <td class="border-r border-gray-700 py-2" align="center">
        <p class="font-mono">{properties.token_api}</p>
      </td>
    </tr>)
}
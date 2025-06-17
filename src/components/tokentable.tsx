import { Html } from "@elysiajs/html"
import { TokenRow } from "./tokenrowtable";
import type { Token } from "../data/apitoken";

interface ApiTokenListProps {
  tokenList: Token[]
};

export default function TokenTable({ tokenList }: ApiTokenListProps) {
  return (
    <div class="flex flex-col gap-4">
      <table
        class="rounded-lg border-collapse table-auto md:table-fixed md:w-auto w-full">
        <thead class="bg-gray-800 text-lg">
          <tr>
            <th>Token</th>
          </tr>
        </thead>
        <tbody>
          {tokenList.map((props) => (
            <TokenRow properties={props} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
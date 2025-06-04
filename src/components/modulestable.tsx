import { Html } from "@elysiajs/html"
import { ModuleRow } from "./modulerowtable";
import Button from "./button";
import { ChevronDown } from "../pages/resources/resources";
import type { Module } from "../data/module";

type HTMLProperties = Record<string, any>;

type ModuleListProps = HTMLProperties & {
  groupName: string;
  moduleList: Module[];
};

export default function ModulesTable({ groupName, moduleList }: ModuleListProps) {
  return (
    <div class="flex flex-col gap-4" x-data="{ open: true }">
      <div class="flex flex-row gap-x-2 w-full items-center transition-colors hover:bg-gray-800 rounded-lg p-2 cursor-pointer select-none">
        <Button 
          x-on:click="open = !open" 
          class="!flex !flex-row !gap-x-2 !rounded-full !p-2 !m-0 "
        >
          <ChevronDown 
            className="w-2 h-2 fill-white transition-transform" 
            x-bind:class="open ? '' : '-rotate-90'"
          />
          
        </Button>
        <h3 
          x-on:click="open = !open" 
          class="m-0">
            {groupName}
        </h3>
        
      </div>

      <table 
        x-show="open"
        x-transition
        class="rounded-lg border-collapse table-auto md:table-fixed md:w-auto w-full">
        <thead class="bg-gray-800 text-lg">
          <tr>
            <th>Alias</th>
            <th>Identificador</th>
            <th>Token API</th>
            <th>Última vez visto</th>
          </tr>
        </thead>
        <tbody>
        {moduleList.map((props) => (
          <ModuleRow properties={props} />
        ))}
        </tbody>
      </table>
    </div>
  );
}
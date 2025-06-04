import BaseLayout, { type BaseLayoutProps } from "../components/baselayout";
import ModulesTable from "../components/modulestable";
import { Html } from "@elysiajs/html";
import { EmptyIcon } from "./resources/resources";
import type { Module, ModuleTable } from "../data/module";

export interface ModuleLayoutProps extends BaseLayoutProps {
  modules?: ModuleTable[]
}

export default function Modules({ modules, navChildren }: ModuleLayoutProps) {
  var content: JSX.Element

  if (modules != undefined && modules.length > 0) {
    const moduleList = modules.reduce((groups, item) => {
      const name = item.group_name ? item.group_name : "Sin Grupo";
      const group = (groups[name] || []);
      group.push(item);
      groups[name] = group;
      return groups;
    }, {} as Record<string, Module[]>);
    content = (
      <div class="flex flex-col gap-4">
        {Object.entries(moduleList).map(([groupName, modules]) => (
          <ModulesTable groupName={groupName} moduleList={modules} />
        ))}
      </div>
    );
  }
  else {
    content = <div class="self-center flex flex-col gap-4">
      <EmptyIcon color="#ffffff" classes="size-96 self-center" />
      <p class="text-lg">
        Parece ser que no tienes ningún módulo. Registra uno con tu dispositivo android.
      </p>
      <a class="text-green-500 hover:text-white underline" href="/about">Saber más</a>
    </div>
  }
  return (<BaseLayout title="Modules" {...{ navChildren }}>
    <div class="flex flex-col p-4 items-left justify-center gap-4">
      <h1>Mis Módulos</h1>
      {content}
    </div>
  </BaseLayout>)
}
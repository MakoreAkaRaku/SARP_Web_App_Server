import BaseLayout, { type BaseLayoutProps } from "../components/baselayout"
import type { Module } from '../data/module'
import { Html } from "@elysiajs/html"
import ModuleForm from "../components/moduleform"
import type { Group } from "../data/group"
import type { Peripheral } from "../data/peripheral"
import Peripherals from "../components/peripherals"

export interface ModuleLayoutProps extends BaseLayoutProps {
  module: Module
  groupList: Group[]
  peripheralList: Peripheral[]
}

export default function Module({ module, groupList, peripheralList, userCredentials }: ModuleLayoutProps) {
  //Make a list of peripherals that the module has
  return (<BaseLayout title="Modules" {...{ userCredentials }}>
    <div class="flex flex-col p-4 items-left justify-center gap-4">
      <h1>Detalles del Módulo</h1>
      <ModuleForm groupList={groupList} module={module} />
      <h1>Periféricos</h1>
      <Peripherals module={module} peripheralList={peripheralList}/>
    </div>
  </BaseLayout>)
}
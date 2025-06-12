import { Html } from '@elysiajs/html'
import type { Module } from '../data/module'
import Input from './input'
import SelectInput from './selectinput'
import type { Group } from '../data/group'
import Button from './button'
import { IconSave } from '../pages/resources/resources'

interface ModuleFormProps {
  module: Module,
  groupList: Group[]
}

export default function ModuleForm({ module, groupList }: ModuleFormProps) {

  const groups = groupList.map(option => {
    return {
      selected: module.belong_group === option.id,
      value: option.id,
      text: option.group_name
    }
  })
  // always add a "No Group assigned" option, but is selected only if no group is assigned
  groups.push({
    selected: groupList.length === 0 || !groups.some(group => group.selected),
    value: -1,
    text: 'Sin Grupo Asignado'
  })

  const fieldClass = 'bg-inherit border-b-2 w-96 p-2 outline-none focus:text-xl focus:border-green-500/60 border-green-800/60'
  return (<form action={`/modules/${module.uuid}`} method="POST" class='text-lg items-center gap-2 flex flex-row justify-between bg-inherit p-6'>
    <div class="flex flex-col gap-2">
      <Input type="text" label='UUID' name="uuid" required disabled value={module.uuid}
        classContainer='flex items-center flex-row gap-8'
        classLabel='font-bold'
        classInput='bg-inherit font-mono w-96'
      />
      <div class='flex items-center flex-row gap-8'>
        <p class="font-bold">Token</p>
        <p class='bg-inherit font-mono w-96'>{module.token_api}</p>
      </div>
    </div>
    <Input type="text" label='Alias' name="alias" required value={module.alias}
      classContainer='flex items-center flex-row gap-8'
      classLabel=''
      classInput={fieldClass}
    />
    <SelectInput label='Grupo' name="belong_group" options={groups}
      classContainer='flex items-center flex-row gap-8'
      classSelect={fieldClass}
    />
    <Button type='submit'>
      <IconSave classes='size-8' />
    </Button>
  </form>)
}
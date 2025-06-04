import { Html } from '@elysiajs/html'

type BaseSelectProps = {
  options?: Array<{ selected: boolean, value: any, text: string }>,
  classSelect?: string
  classOption?: string
  classLabel?: string
  classContainer?: string
  label?: string
  name: string
}

export default function SelectInput({ name, options, label, classLabel, classSelect, classContainer, classOption }: BaseSelectProps) {
  return (<div class={classContainer}>
    {label && <label class={classLabel}>{label}</label>}
    <select class={classSelect} name={name}>
      {options && options.map(option => {
        if (option.selected) {
          return (<option class={classOption} value={`${option.value}`} selected>{option.text}</option>)
        }
        return (<option value={`${option.value}`}>{option.text}</option>)
      })}
    </select>
  </div>)
}
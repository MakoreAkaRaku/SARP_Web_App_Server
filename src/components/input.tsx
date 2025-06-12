import { Html } from "@elysiajs/html";

type BaseInputProps = {
  id?: string
  type: 'textarea' | 'text' | 'email' | 'password' | 'string' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file' | 'hidden';
  accept?: string;
  alt?: string;
  autocomplete?: string;
  autofocus?: string;
  checked?: boolean;
  disabled?: boolean;
  form?: string;
  formaction?: string;
  formenctype?: string;
  formmethod?: string;
  formnovalidate?: boolean;
  formtarget?: string;
  height?: string;
  list?: string;
  max?: string;
  maxlength?: string;
  min?: string;
  minlength?: string;
  multiple?: boolean;
  pattern?: string;
  readonly?: boolean;
  size?: string;
  src?: string;
  step?: string;
  width?: string;
}

export type InputProps = BaseInputProps & {

  name: string,
  classLabel?: string,
  classInput?: string,
  label?: string,
  required?: boolean,
  placeholder?: string,
  value?: string,
  classContainer?: string,
}

export default function Input({
  type,
  label,
  name,
  value,
  classContainer = "mb-5",
  classLabel = "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
  classInput = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
  ...rest }: InputProps) {
  return (
    <div class={classContainer}>
      {
        label && <label for={name} class={classLabel}>{label}</label>
      }
      {type == 'textarea' ?
        <textarea name={name} {...rest} class={classInput}>{value}</textarea>
        :
        <input type={type} name={name} value={value} {...rest} class={classInput} />
      }
    </div>
  )
}
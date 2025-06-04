import { Html } from "@elysiajs/html";

type BaseButtonProps = {
  id?: string;
  class?: string;
  style?: string;
  disabled?: boolean;
  autofocus?: string;
  name?: string;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  draggable?: boolean;
  hidden?: boolean;
}

export type ButtonProps = BaseButtonProps & {
  color?: 'default' | 'blue' | 'dark' | 'green' | 'red' | 'yellow' | 'purple';
  children?: any
}

function getClassesForColor(color: ButtonProps['color']) {
  switch (color) {
    case 'default':
      return "rounded-md p-2 bg-green-700 hover:bg-green-500";
    case 'blue':
      return "text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800";
    case 'dark':
      return "text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800";
    case 'green':
      return "text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800";
    case 'red':
      return "text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900";
    case 'yellow':
      return "text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900";
    case 'purple':
      return "text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900";
  }
};

function cn(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ')
}



export default function Button({ children, color='default', ...rest }: ButtonProps) {

  return (
    <button {...rest} class={cn(rest.class, getClassesForColor(color))}>
      {children}
    </button>
  )
}
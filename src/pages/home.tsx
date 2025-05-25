import BaseLayout, { type BaseLayoutProps } from "../components/baselayout";
import { Html } from "@elysiajs/html";

export default function Home({ children,navChildren }: BaseLayoutProps) {

  return (
  <BaseLayout title="Home" {...{ navChildren }}>
    {children}
  </BaseLayout>)
}
import BaseLayout, { type BaseLayoutProps } from "../components/baselayout";
import { Html } from "@elysiajs/html";

export default function Home({ children, userCredentials }: BaseLayoutProps) {

  return (
  <BaseLayout title="Home" {...{ userCredentials }}>
    {children}
  </BaseLayout>)
}
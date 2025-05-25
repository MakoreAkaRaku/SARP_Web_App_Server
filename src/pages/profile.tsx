import BaseLayout, { type BaseLayoutProps } from "../components/baselayout";
import { Html } from "@elysiajs/html";

export default function Profile({ children,navChildren }: BaseLayoutProps) {

  return (
  <BaseLayout title="Profile" {...{ navChildren }}>
    {children}
  </BaseLayout>)
}
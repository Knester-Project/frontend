import { createFileRoute } from '@tanstack/react-router';
import Contact from "@/pages/Contact";

export const Route = createFileRoute('/_auth/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Contact />
}

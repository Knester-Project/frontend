import { createFileRoute } from '@tanstack/react-router';

// UIs
import Create from "@/pages/Create/index";

export const Route = createFileRoute('/_auth/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Create />
}

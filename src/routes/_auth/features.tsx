import { createFileRoute } from '@tanstack/react-router';

// UIs
import Features from "@/pages/Features";

import { APP_NAME } from '../__root';

export const Route = createFileRoute('/_auth/features')({
  head: () => ({
    meta: [
      {
        title: `Features | ${APP_NAME}`,
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <Features />
}

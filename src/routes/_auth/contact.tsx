import { createFileRoute } from '@tanstack/react-router';

// UIs
import Contact from "@/pages/Contact";

import { APP_NAME } from '../__root';

export const Route = createFileRoute('/_auth/contact')({
  head: () => ({
    meta: [
      {
        title: `Contact | ${APP_NAME}`,
      },
    ],
  }),

  component: RouteComponent,
})

function RouteComponent() {
  return <Contact />
}

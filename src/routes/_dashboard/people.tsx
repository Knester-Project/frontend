import { createFileRoute } from '@tanstack/react-router';

// UIs
import People from "@/pages/User/People";

import { APP_NAME } from '../__root';

export const Route = createFileRoute('/_dashboard/people')({

  head: () => ({
    meta: [
      {
        title: `People | ${APP_NAME}`,
      },
    ],
  }),

  validateSearch: (search: Record<string, string>) => ({
    mode: search.mode as string,
  }),

  component: RouteComponent,
})

function RouteComponent() {
  return <People />
}

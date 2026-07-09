import { createFileRoute } from '@tanstack/react-router';

import { APP_NAME } from '../__root';

export const Route = createFileRoute('/_dashboard/messages')({

  head: () => ({
    meta: [
      {
        title: `Messages | ${APP_NAME}`,
      },
    ],
  }),

  validateSearch: (search: Record<string, string | undefined>) => ({
    username: search.username as string | undefined,
  }),

  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/messages"!</div>
}

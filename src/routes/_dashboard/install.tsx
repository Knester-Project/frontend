import { createFileRoute } from '@tanstack/react-router';

import { APP_NAME } from '../__root';

export const Route = createFileRoute('/_dashboard/install')({
  head: () => ({
    meta: [
      {
        title: `Installation | ${APP_NAME}`,
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/install"!</div>
}

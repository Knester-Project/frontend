import { createFileRoute } from '@tanstack/react-router';

// UIs
import Feed from '@/pages/User/Feed';

import { APP_NAME } from '../__root';

export const Route = createFileRoute('/_dashboard/feed')({
  head: () => ({
    meta: [
      {
        title: `Your Feed | ${APP_NAME}`,
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <Feed />
}

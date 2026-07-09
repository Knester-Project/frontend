import { createFileRoute } from '@tanstack/react-router';

// UIs
import Safety from '@/pages/User/Safety';

import { APP_NAME } from '../__root';

export const Route = createFileRoute('/_dashboard/safety')({

  head: () => ({
    meta: [
      {
        title: `Safety | ${APP_NAME}`,
      },
    ],
  }),

  validateSearch: (search: Record<string, unknown>) => ({
    state: search.state as string | undefined,
    city: search.city as string | undefined,
    street: search.street as string | undefined,
    name: search.name as string | undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <Safety />
}

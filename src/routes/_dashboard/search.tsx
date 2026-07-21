import { createFileRoute } from '@tanstack/react-router';

import { APP_NAME } from '../__root';

// UIs
import Search from "@/pages/User/Search";

export const Route = createFileRoute('/_dashboard/search')({

  head: () => ({
    meta: [
      {
        title: `Search | ${APP_NAME}`,
      },
    ],
  }),

  validateSearch: (search: Record<string, string>) => ({
    tags: search.tags as string,
  }),

  component: RouteComponent,
})

function RouteComponent() {
  return <Search />
}

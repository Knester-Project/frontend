import { createFileRoute } from '@tanstack/react-router';

// UIs
import MarketPlace from "@/pages/User/MarketPlace";

import { APP_NAME } from '../__root';

export const Route = createFileRoute('/_dashboard/market')({
  head: () => ({
    meta: [
      {
        title: `Market Place | ${APP_NAME}`,
      },
    ],
  }),

  component: RouteComponent,
})

function RouteComponent() {
  return <MarketPlace />
}

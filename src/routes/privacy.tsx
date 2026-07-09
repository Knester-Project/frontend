import { createFileRoute } from '@tanstack/react-router'
import { APP_NAME } from './__root'

export const Route = createFileRoute('/privacy')({

  head: () => ({
    meta: [
      {
        title: `Privacy Policies | ${APP_NAME}`,
      },
    ],
  }),

  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/privacy"!</div>
}

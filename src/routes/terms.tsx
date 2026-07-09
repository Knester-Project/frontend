import { createFileRoute } from '@tanstack/react-router'
import { APP_NAME } from './__root'

export const Route = createFileRoute('/terms')({

  head: () => ({
    meta: [
      {
        title: `Terms | ${APP_NAME}`,
      },
    ],
  }),

  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/terms"!</div>
}

import { createFileRoute } from '@tanstack/react-router';

import { APP_NAME } from '@/routes/__root';

export const Route = createFileRoute('/_dashboard/messages/$id')({
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.id} | Messages | ${APP_NAME}`,
      },
      {
        name: "",
        content: `Verify the authenticity and current status of Oxford Petroleum Corporation document ${params.id}.`,
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/messages/$id"!</div>
}

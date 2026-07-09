import { createFileRoute } from '@tanstack/react-router';
import WaitList from "@/pages/WaitList";
import { APP_NAME } from '../__root';

export const Route = createFileRoute('/_auth/waitlist')({

  head: () => ({
    meta: [
      {
        title: `Wait List | ${APP_NAME}`,
      },
    ],
  }),

  component: RouteComponent,
})

function RouteComponent() {
  return <WaitList />
}

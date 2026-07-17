import { createFileRoute } from '@tanstack/react-router';

// UIs
import Onboarding from '@/pages/Onboarding';

import { APP_NAME } from '../__root';

export const Route = createFileRoute('/_auth/onboarding')({

  head: () => ({
    meta: [
      {
        title: `Onboarding | ${APP_NAME}`,
      },
    ],
  }),

  component: RouteComponent,
})

function RouteComponent() {
  return <Onboarding />
}

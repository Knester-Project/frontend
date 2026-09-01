import { createFileRoute } from '@tanstack/react-router';
import { APP_NAME } from '../__root';

// Queries
import { allConversationsOptions, singleConversationOptions } from '@/services/userQueries';

// UIs
import Chat from "@/pages/User/Chat";
import Loader from '@/pages/User/Chat/Loader';
import ErrorPage from '@/components/errors/Custom';

export const Route = createFileRoute('/_dashboard/messages')({

  head: () => ({
    meta: [
      {
        title: `Messages | ${APP_NAME}`,
      },
    ],
  }),

  validateSearch: (search: Record<string, string | undefined>) => ({
    username: search.username as string | undefined,
    group: search.group as string | undefined,
  }),

  loaderDeps: ({ search: { username } }) => ({ username }),

  loader: async ({ context: { queryClient }, deps: { username } }) => {
    // If we have a specific user, ensure we have their chat data
    if (username) {
      return queryClient.ensureQueryData(singleConversationOptions(username));
    }

    // Otherwise, ensure we have the main inbox list loaded
    return queryClient.ensureInfiniteQueryData(allConversationsOptions());
  },

  component: Chat,

  pendingComponent: () => <Loader />,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorComponent: (error: any) => (
    <ErrorPage
      showRetryButton={false}
      code={error.error.status}
      title={error.error?.status === 404 ? "Chat Not Found" : (error.error.response.data.message || "Something went wrong")}
      description="We couldn't load this conversation."
    />
  ),
});
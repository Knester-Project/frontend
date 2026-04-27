import { createFileRoute } from '@tanstack/react-router';
import { userProfileOptions } from '@/services/userQueries';

// UIs
import Profile from '@/pages/User/Profile';
import ErrorPage from '@/components/errors/Custom';
import ProfileLoader from '@/pages/User/Profile/ProfileLoader';

export const Route = createFileRoute('/_dashboard/profile')({

  validateSearch: (search: Record<string, string>) => ({
    profile: search.profile as string,
  }),

  // LoaderDeps to tell the loader which search params to watch
  loaderDeps: ({ search: { profile } }) => ({ profile }),

  // Access 'deps' in the loader
  loader: ({ context: { queryClient }, deps: { profile } }) => {
    return queryClient.ensureQueryData(userProfileOptions(profile));
  },
  component: Profile,

  // Handle errors at the route level
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorComponent: (error: any) => (
    <>
      {error.error.status === 404
        ?
        <ErrorPage code="404" title="Profile Not Found"
          description="We couldn't find a profile matching that username. Try checking the spelling or searching for a different name." />
        :
        <ErrorPage />
      }
    </>
  ),

  // Show a skeleton while the loader is running
  pendingComponent: () => <ProfileLoader />,
});


import { Outlet, createRootRoute } from '@tanstack/react-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

//Toast and Theme
import { Toaster } from "sileo";
import { ThemeProviderEffect } from '@/components/ThemeProvider';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
            staleTime: 1 * 60000,
            refetchOnMount: false,
            refetchOnReconnect: true,
            refetchOnWindowFocus: true,
            gcTime: 7 * 60000,
        }
    }
})


export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            <Outlet />
            <ThemeProviderEffect />
            <Toaster position="top-center" theme="system" />
        </QueryClientProvider>
    )
}

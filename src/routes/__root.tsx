import { Outlet, createRootRoute } from '@tanstack/react-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

//Toast and Theme
import { Toaster } from "sileo";
import { ThemeProviderEffect } from '@/components/ThemeProvider';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 5,
            retryDelay: 1000,
            refetchOnWindowFocus: false,
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

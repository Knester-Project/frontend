import { Outlet } from '@tanstack/react-router';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

//Toast and Theme
import { Toaster } from "sileo";
import { ThemeProviderEffect } from '@/components/ThemeProvider';

export const APP_NAME = "Knester";

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

// Define the type for your context
interface MyRouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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

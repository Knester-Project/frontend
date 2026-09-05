import { Outlet } from '@tanstack/react-router';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

// Toast and Theme, and Providers
import { Toaster } from "sileo";
import { ThemeProviderEffect } from '@/features/theme/ThemeProvider';
import { NotificationInitializer } from '@/providers/Push';
import { LocationGate } from '@/features/location/LocationGate';
import { LocationProvider } from '@/providers/Location';

// UIs
import NotFound from "@/pages/NotFound";
import RestoreLastRoute from '@/components/common/RestoreRoute';

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
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                title: APP_NAME,
            },
        ],
    }),
    component: RootComponent,
    notFoundComponent: NotFound,
})

function RootComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            <LocationProvider>
                <LocationGate>
                    <NotificationInitializer>
                        <Outlet />
                        <RestoreLastRoute />
                        <ThemeProviderEffect />
                        <Toaster position="top-center" theme="system" />
                    </NotificationInitializer>
                </LocationGate>
            </LocationProvider>
        </QueryClientProvider>
    )
}

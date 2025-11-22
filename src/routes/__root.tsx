import { Outlet, createRootRoute } from '@tanstack/react-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

//Toast and Theme
import { ToastContainer } from "react-fox-toast";
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
            <ToastContainer position="top-center" isPausedOnHover={true} duration={5000} />
            <ThemeProviderEffect />
            <Outlet />
        </QueryClientProvider>
    )
}

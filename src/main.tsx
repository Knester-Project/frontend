import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';

//Styles
import './index.css';

// Import the generated route tree
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
  routeTree, context: {
    queryClient: queryClient,
  },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

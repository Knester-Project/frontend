import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';

// Styles and Stores
import './index.css';
import { useInstallStore } from './stores/install.store';

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

// Register the Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered with scope:', registration.scope);
      })
      .catch((err) => {
        console.error('SW registration failed:', err);
      });
  });
}

// Installation Prompt
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();

  useInstallStore
    .getState()
    .setDeferredPrompt(event as BeforeInstallPromptEvent);
});

window.addEventListener("appinstalled", () => {
  const store = useInstallStore.getState();

  store.setDeferredPrompt(null);
  store.setInstalled(true);
});
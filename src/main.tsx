import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';
import { sileo } from 'sileo';

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
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("SW registered with scope:", registration.scope,);

      // Check whether an update is already waiting.
      if (registration.waiting) {
        showUpdateToast(registration);
      }

      // Listen for a new Service Worker being found.
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          // A new SW has finished installing and there is already an active SW controlling the page.
          // This means this is an UPDATE, not the first install.
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            showUpdateToast(registration);
          }
        });
      });
    } catch (error) {
      console.error("SW registration failed:", error);
    }
  });
}

// Show Update Toast
function showUpdateToast(registration: ServiceWorkerRegistration) {
  console.log("New Knester version available.");
  sileo.action({
    title: "Update available",
    description: "A new version of Knester is ready.",
    button: {
      title: "Update",
      onClick: () => {
        updateServiceWorker(registration);
      },
    },
  });
}

function updateServiceWorker(registration: ServiceWorkerRegistration) {
  if (!registration.waiting) return;

  // Tell the waiting Service Worker, "You can activate now."
  registration.waiting.postMessage({
    type: "SKIP_WAITING",
  });

  // Wait until the new Service Worker takes control.
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  }, { once: true },
  );
}


// Installation Prompt
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();

  useInstallStore
    .getState()
    .setDeferredPrompt(event as BeforeInstallPromptEvent);
});

// Installed
window.addEventListener("appinstalled", () => {
  const store = useInstallStore.getState();

  store.setDeferredPrompt(null);
  store.setInstalled(true);
});
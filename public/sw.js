// Service Worker Life Cycle
self.addEventListener("install", () => {
  // Intentionally do NOT call skipWaiting().
  // The new Service Worker will remain in the
  // "waiting" state until the React application
  // tells it to activate.
});

self.addEventListener("activate", (event) => {
  // Allow the activated Service Worker to control
  // existing/open Knester pages.
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Listen for the incoming Push Event from the OS
self.addEventListener("push", (event) => {
  // If there's no data, do nothing
  if (!event.data) return;

  try {
    // We will send JSON payloads from our Fastify backend
    const data = event.data.json();

    // Configure how the OS renders the notification popup
    const options = {
      body: data.message,
      icon: "/128.png", // Replace with your app's logo in the public folder
      badge: "/short_logo.png", // A small monochromatic icon for Android status bars
      vibrate: [200, 100, 200], // Android vibration pattern
      data: {
        // We pass a URL so we know where to take the user if they click it
        url: data.url || "/feed",
      },
    };

    // Tell the OS to keep the Service Worker awake until the notification is drawn
    event.waitUntil(self.registration.showNotification(data.title, options));
  } catch (error) {
    console.error("Error parsing push payload:", error);
  }
});

// Listen for the user clicking the notification popup
self.addEventListener("notificationclick", (event) => {
  // Instantly close the notification popup
  event.notification.close();

  const targetUrl = event.notification.data.url || "/feed";

  // Tell the OS to keep the Service Worker awake while we search for open tabs
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if the user already has a tab of knester open
        for (const client of clientList) {
          if ("focus" in client) {
            return client.navigate(targetUrl).then(() => client.focus());
          }
        }

        // If they don't have the app open, launch a new tab straight to the URL
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});

// Required for the browser to recognize this as an installable PWA
self.addEventListener("fetch", (event) => {
  // TODO: For now, just pass the request through to the network normally, add offline caching logic here if you want.
  event.respondWith(fetch(event.request));
});

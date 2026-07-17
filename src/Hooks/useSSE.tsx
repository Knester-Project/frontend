import { useEffect } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useNotifications = (enabled: boolean) => {
  useEffect(() => {
    // Wait until the user is verified before opening the stream
    if (!enabled) return;

    const eventSource = new EventSource(`${BASE_URL}notification/stream`, {
      withCredentials: true,
    });

    eventSource.addEventListener("connected", (event) => {
      console.log("SSE Stream Connected:", JSON.parse(event.data));
    });

    eventSource.addEventListener("notification:new", (event) => {
      const newNotification = JSON.parse(event.data);
      console.log("New Notification!", newNotification);

      // Update your global notification state here
      // e.g., useNotificationStore.getState().addNotification(newNotification);
    });

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
    };

    return () => {
      // Automatically closes the connection when the user logs out
      eventSource.close();
    };
  }, [enabled]);
};
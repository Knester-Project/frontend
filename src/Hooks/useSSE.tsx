import { useEffect } from "react";
import { sileo } from "sileo";

// Enums
import { NOTIF_TYPES } from "@/enums";

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

      const newNotification: InAppNotification = JSON.parse(event.data);
      console.log("New Notification!", newNotification);

      const config = NOTIF_TYPES[newNotification.type];

      sileo.info({
        title: newNotification.title,
        description: newNotification.message,
        icon: config.icon,
        styles: {
          description: "text-center!",
        },
      })

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
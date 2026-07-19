import { useEffect } from "react";
import { sileo } from "sileo";

// Enums and Utils
import { NOTIF_TYPES } from "@/enums";
import { dateConverter } from "@/utils/format";

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
      console.log("New Notification Received:", newNotification);
      const config = NOTIF_TYPES[newNotification.type];

      sileo.info({
        title: newNotification.title,
        description:
          <main className="flex flex-col items-center gap-y-1 text-black dark:text-white text-center">
            <h2 className="font-semibold capitalize">{newNotification.message}</h2>
            <p className="text-[10px] text-gray-600 md:text-[11px] dark:text-gray-300 xl:text-xs">{dateConverter(newNotification.createdAt)}</p>
          </main>,
        icon: <span className="text-2xl">{config.icon}</span>,
        styles: {
          title: "uppercase font-bold",
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
import { useEffect } from "react";

// Using the same BASE_URL pattern you already have for Axios
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useNotifications = () => {
  useEffect(() => {
    // Point directly to the SSE endpoint
    // Add 'withCredentials: true' to force the browser to send the HTTP-only cookie
    const eventSource = new EventSource(`${BASE_URL}/notification/stream`, {
      withCredentials: true, 
    });

    // Listen for the connection success event
    eventSource.addEventListener("connected", (event) => {
      console.log("SSE Stream Connected:", JSON.parse(event.data));
    });

    // Listen for your custom notification events
    eventSource.addEventListener("notification:new", (event) => {
      const newNotification = JSON.parse(event.data);
      console.log("New Notification!", newNotification);
      // Update your notification state here
    });

    // Handle errors (like lost connection)
    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      // EventSource automatically tries to reconnect, but you can manage state here
    };

    // Cleanup on component unmount
    return () => {
      eventSource.close();
    };
  }, []);
};
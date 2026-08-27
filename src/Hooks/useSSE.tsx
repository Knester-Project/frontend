/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { sileo } from "sileo";
import { useQueryClient } from "@tanstack/react-query";

// Enums and Utils
import { NOTIF_TYPES } from "@/enums";
import { dateConverter } from "@/utils/format";

const BASE_URL = import.meta.env.VITE_BASE_URL;


export const useNotifications = (enabled: boolean, queries: CursorQueries) => {

  const queryClient = useQueryClient();

  // Store queries in a ref
  const queriesRef = useRef(queries);

  useEffect(() => {
    queriesRef.current = queries;
  }, [queries]);

  useEffect(() => {

    if (!enabled) return;

    const eventSource = new EventSource(`${BASE_URL}notification/stream`, {
      withCredentials: true,
    });

    eventSource.addEventListener("connected", (event) => {
      console.log("SSE Stream Connected:", JSON.parse(event.data));
    });

    eventSource.addEventListener("notification:new", (event) => {

      const newNotification: InAppNotification = JSON.parse(event.data);
      const config = NOTIF_TYPES[newNotification.type];

      sileo.info({
        title: newNotification.title,
        description: (
          <main className="flex gap-x-2 text-black">
            <img
              src={newNotification?.sender?.profile?.profilePicture || "/blank.jpg"}
              alt="Profile Picture"
              className="rounded-lg size-8 object-cover"
            />
            <div>
              <p className="font-semibold capitalize" dangerouslySetInnerHTML={{ __html: newNotification.message }} />
              <p className="text-[10px] text-gray-600 md:text-[11px] xl:text-xs">
                When?: {dateConverter(newNotification.createdAt)}
              </p>
            </div>
          </main>
        ),
        icon: <span className="text-xl">{config.icon}</span>,
        fill: "#FFFAF3",
        styles: {
          title: "uppercase font-bold",
        },
      });

      // Update your notification data here
      if (newNotification.oneTime) return;

      // Optimistically increase the Unread Count
      queryClient.setQueryData(['notification-unread'], (oldResponse: any) => {
        if (oldResponse?.data && typeof oldResponse.data.count === 'number') {
          return {
            ...oldResponse,
            data: {
              ...oldResponse.data,
              count: oldResponse.data.count + 1
            }
          };
        }
        return oldResponse;
      });

      queryClient.setQueryData(['notification', queriesRef.current], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;

        const newPages = [...oldData.pages];

        newPages[0] = {
          ...newPages[0],
          data: {
            ...newPages[0].data,
            data: [newNotification, ...(newPages[0].data?.data || [])]
          }
        };

        return {
          ...oldData,
          pages: newPages
        };
      });
    });

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
    };

    return () => {
      eventSource.close();
    };
  }, [enabled, queryClient]);
};
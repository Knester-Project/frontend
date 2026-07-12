import { useState } from "react";
import { sileo } from "sileo";

// Utils and Services
import { urlBase64ToUint8Array } from "@/utils/generate";
import { useNewNotSub } from "@/services/userMutations";

const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export const PushNotificationButton = () => {

    const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
    const newSub = useNewNotSub()

    const subscribeToPush = async () => {
        setIsSubscribing(true);

        try {
            // Ask the user for permission to send notifications
            const permission = await Notification.requestPermission();

            if (permission !== "granted") {
                alert("You need to allow notifications in your browser settings.");
                setIsSubscribing(false);
                return;
            }

            // Make sure the Service Worker is ready
            const registration = await navigator.serviceWorker.ready;

            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

            // Ask the browser to generate the Subscription Object
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });

            // Call mutation service
            newSub.mutate(subscription, {
                onSuccess: () => {
                    sileo.success({
                        title: "Successful",
                        description: "Successfully subscribed to push notifications!"
                    });
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (error: any) => {
                    const message = error?.response?.data?.message || "Couldn't subscribe to push notifications now, kindly try again later.";
                    sileo.error({ title: "Error", description: message });
                },
            });

        } catch (error) {
            console.error("Failed to subscribe to push notifications:", error);
            sileo.error({
                title: "Something Went Wrong", description:
                    "Something went wrong while setting up notifications."
            });
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <button
            onClick={subscribeToPush}
            disabled={isSubscribing}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded text-white"
        >
            {isSubscribing ? "Enabling..." : "Enable Push Notifications"}
        </button>
    );
};
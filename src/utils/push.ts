// Check if Push Notification is supported
export function supportsPushNotifications() {
    return (
        typeof window !== "undefined" &&
        "Notification" in window &&
        "serviceWorker" in navigator &&
        "PushManager" in window
    );
}

// Get Worker Registration
export async function getRegistration() {
    return navigator.serviceWorker.ready;
}

// Subscription
export async function getSubscription() {
    const registration = await navigator.serviceWorker.ready;
    return registration.pushManager.getSubscription();
}
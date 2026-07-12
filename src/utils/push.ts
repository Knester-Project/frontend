export function supportsPushNotifications() {
    return (
        typeof window !== "undefined" &&
        "Notification" in window &&
        "serviceWorker" in navigator &&
        "PushManager" in window
    );
}

export async function getRegistration() {
    return navigator.serviceWorker.ready;
}

export async function getSubscription() {
    const registration = await navigator.serviceWorker.ready;
    return registration.pushManager.getSubscription();
}
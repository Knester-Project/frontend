/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateUsername } from 'unique-username-generator';

// Returns generated usernames
export function generateCustomUsernames(userInput: string) {
  const usernames = [];

  // Clean the user input to remove any special characters
  const cleanInput = userInput.replace(/[^A-Za-z0-9]/g, '');

  // Generate three usernames
  for (let i = 0; i < 3; i++) {
    // Generate a username with a separator, random digits, and a maximum length
    const username = generateUsername(".", 0, 20, cleanInput);
    usernames.push(username);
  }

  return usernames;
}

// Returns Array of strings like ["variant01", "variant02", ...]
export function generateVariants(count: number, prefix: string = "variant"): string[] {
  return Array.from({ length: count }, (_, index) => {
    // Arrays start at 0, so we add 1 to start our variants at 1
    const number = index + 1;

    // padStart(2, '0') turns "1" into "01", but leaves "15" as "15"
    const formattedNumber = String(number).padStart(2, '0');

    return `${prefix}${formattedNumber}`;
  });
}

// Get Dirty Values
export const getDirtyValues = <T extends Record<string, any>>(
  dirtyFields: Record<string, any>,
  formValues: T
): Partial<T> => {
  const changes: Partial<T> = {};

  Object.keys(dirtyFields).forEach((key) => {
    const typedKey = key as keyof T;
    const dirtyState = dirtyFields[key];
    const value = formValues[typedKey];

    // If the dirty state is a nested object, traverse recursively
    if (typeof dirtyState === "object" && dirtyState !== null && !Array.isArray(dirtyState)) {
      changes[typedKey] = getDirtyValues(dirtyState, value) as any;
    } else {
      // If dirtyState is true, grab the new value
      changes[typedKey] = value;
    }
  });

  return changes;
};

// Get Changed Values
export function getChangedValues(prev: Record<string, string | number>, latest: Record<string, string | number>): Partial<Record<string, string | number>> {
  const changed: Partial<Record<string, string | number>> = {};

  (Object.keys(latest) as (keyof Record<string, string | number>)[]).forEach((key) => {
    if (prev[key] !== latest[key]) {
      changed[key] = latest[key];
    }
  });

  return changed;
}

// Convert Public VAPID Key from Base64 to Uint8Array
export const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// Push Subscription Serializer
export function serializeSubscription(subscription: PushSubscription): PushSubscriptionPayload {

  const json = subscription.toJSON();

  return {
    endpoint: json.endpoint!,
    expirationTime: json.expirationTime ?? null,

    keys: {
      p256dh: json.keys?.p256dh ?? "",
      auth: json.keys?.auth ?? "",
    },
  };
}

// Change the selected for Genre Form
type Genres = Record<string, { count: number; lastInteracted: Date }>;

export function toGenres(arr: string[]): Genres {
  const now = new Date();
  return arr.reduce<Genres>((acc, key) => {
    acc[key] = { count: 1, lastInteracted: now };
    return acc;
  }, {});
}

// Build Notification URL
export function buildNotificationUrl(type: NotificationType, entity?: Record<string, any>, username?: string) {

  switch (type) {
    case "profile_lookup":
    case "new_follower":
    case "follow_request":
    case "follow_request_accepted":
      return username
        ? `/profile?profile=${username}`
        : "/";

    case "post_like":
    case "post_comment":
    case "comment_reply":
    case "reply_reply":
    case "comment_like":
    case "post_shared":
    case "post_repost":
    case "mention":
    case "tagged":
      return `/post/${entity?.postId}`;

    case "story_reaction":
    case "story_mention":
      return `/story/${entity?.storyId}`;

    case "message":
      return `/messages/${entity?.conversationId}`;

    case "group_invite":
      return `/groups/${entity?.groupId}`;

    case "event_invite":
      return `/events/${entity?.eventId}`;

    case "order_update":
      return `/order/${entity?.orderId}`;

    default:
      return "/";
  }
}

// For the message duration
export const getTtlMs = (ttlValue?: string | number): number => {
  const DEFAULT_MS = 24 * 60 * 60 * 1000;

  if (!ttlValue) return DEFAULT_MS;

  const ttlStr = String(ttlValue).toLowerCase();

  // Handle explicit string formats (if you ever use them)
  if (ttlStr === '24h' || ttlStr === '1d') return DEFAULT_MS;
  if (ttlStr === '3d') return 3 * 24 * 60 * 60 * 1000;
  if (ttlStr === '7d') return 7 * 24 * 60 * 60 * 1000;

  // Handle numeric values from your backend (e.g., "86400")
  const parsedSeconds = parseInt(ttlStr, 10);

  if (!isNaN(parsedSeconds)) {
    return parsedSeconds * 1000;
  }

  return DEFAULT_MS;
};
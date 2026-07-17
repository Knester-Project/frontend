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
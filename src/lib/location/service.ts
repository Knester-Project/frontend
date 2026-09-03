import { getStoredLocation, saveStoredLocation } from "./storage";

// Services and Constants
import { updateProfile } from "@/services/api.services";
const SIX_HOURS = 6 * 60 * 60 * 1000;

// Minimum movement before syncing with backend.
const MINIMUM_DISTANCE = 100;

class LocationService {

    // Returns whether the browser supports geolocation.
    isSupported(): boolean {
        return (
            typeof window !== "undefined" &&
            "geolocation" in navigator
        );
    }

    // Returns the browser permission state.
    async getPermission(): Promise<LocationPermission> {
        if (!this.isSupported()) return "unsupported";

        if (!("permissions" in navigator)) return "unknown";

        try {
            const permission = await navigator.permissions.query({
                name: "geolocation",
            });
            return permission.state;
        } catch {
            return "unknown";
        }
    }

    // Listen for permission changes.
    async watchPermission(callback: (state: PermissionState) => void) {
        if (!this.isSupported() || !("permissions" in navigator)) {
            return;
        }
        try {
            const permission = await navigator.permissions.query({
                name: "geolocation",
            });

            callback(permission.state);
            permission.onchange = () => {
                callback(permission.state);
            };
        } catch {
            // Ignore
        }
    }

    // Request the current location.
    async requestLocation(): Promise<Coordinates> {
        if (!this.isSupported()) {
            throw new Error("Geolocation is not supported by this browser.");
        }
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    resolve({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        accuracy: coords.accuracy,
                    });
                },
                reject,
                {
                    enableHighAccuracy: true,
                    timeout: 15000, // 15 Seconds
                    maximumAge: 0,
                }
            );
        });
    }

    // Returns the cached location if it's still fresh.
    getCachedLocation(): StoredLocation | null {

        const cached = getStoredLocation();
        if (!cached) return null;

        const expired = Date.now() - cached.timestamp > SIX_HOURS;
        if (expired) return null;

        return cached;
    }

    // Save location locally.
    cacheLocation(coords: Coordinates): StoredLocation {
        return saveStoredLocation(coords);
    }

    // Determines whether the backend should receive an update.
    shouldSync(coords: Coordinates): boolean {

        const cached = getStoredLocation();
        if (!cached) return true;

        const distance = this.distanceBetween(
            cached.coords,
            coords
        );
        return distance >= MINIMUM_DISTANCE;
    }

    // Synchronize with backend.
    async sync(coords: Coordinates): Promise<void> {
        await updateProfile({
            location: coords,
        });

        this.cacheLocation(coords);
    }

    // Haversine distance. Returns metres.
    distanceBetween(first: Coordinates, second: Coordinates): number {

        const R = 6371000;

        const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
        const dLat = toRadians(second.latitude - first.latitude);
        const dLon = toRadians(second.longitude - first.longitude);

        const lat1 = toRadians(first.latitude);
        const lat2 = toRadians(second.latitude);

        const a =
            Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +
            Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        return (2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }

    // Returns true if the cached location is stale.
    isCacheExpired(): boolean {
        const cached = getStoredLocation();
        if (!cached) return true;

        return (Date.now() - cached.timestamp > SIX_HOURS);
    }
}

export const locationService = new LocationService();
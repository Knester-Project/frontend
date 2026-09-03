import { create } from "zustand";

// Services and Storage
import { locationService } from "@/lib/location/service";
import { clearStoredLocation } from "@/lib/location/storage";

const MAX_LOCATION_ACCURACY = 100; // meters

const isValidLocation = (coordinates: Coordinates | null): boolean => {
    if (!coordinates) return false;

    const { latitude, longitude, accuracy } = coordinates;

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return false;
    }

    if (!Number.isFinite(accuracy)) {
        return false;
    }

    return accuracy <= MAX_LOCATION_ACCURACY;
};

interface LocationStore extends LocationState {

    hasCachedLocation: boolean;
    hasValidLocation: boolean;

    initialize: () => Promise<void>;
    requestLocation: () => Promise<Coordinates | null>;
    refreshLocation: () => Promise<void>;
    clearLocation: () => void;

    setPermission: (permission: LocationPermission) => void;
}

export const useLocationStore = create<LocationStore>((set, get) => ({
    hasCachedLocation: false,
    hasValidLocation: false,

    permission: "unknown",
    coordinates: null,
    loading: false,
    initialized: false,
    lastUpdated: null,

    setPermission(permission) {
        set({ permission });
    },

    async initialize() {
        if (get().initialized) return;

        const permission = await locationService.getPermission();

        set({ permission });

        // Listen for permission changes.
        locationService.watchPermission((permission) => {
            set({ permission });
        });

        // Hydrate from cache.
        const cached = locationService.getCachedLocation();

        if (cached) {
            const valid = isValidLocation(cached.coords);
            set({
                coordinates: cached.coords,
                lastUpdated: cached.timestamp,
                hasCachedLocation: true,
                hasValidLocation: valid,
            });
        }

        // Automatically refresh if permission is already granted.
        if (permission === "granted") {
            await get().refreshLocation();
        }

        set({ initialized: true });
    },

    async requestLocation() {
        if (get().loading) {
            return get().coordinates;
        }

        set({ loading: true });

        try {
            const coords = await locationService.requestLocation();
            const valid = isValidLocation(coords);

            // Received coordinates, but not accurate enough.
            if (!valid) {
                set({
                    coordinates: coords,
                    hasCachedLocation: true,
                    hasValidLocation: false,
                    lastUpdated: Date.now(),
                    permission: "granted",
                });

                return null;
            }

            // Valid device location.
            set({
                coordinates: coords,
                lastUpdated: Date.now(),
                permission: "granted",
                hasCachedLocation: true,
                hasValidLocation: true,
            });

            if (locationService.shouldSync(coords)) {
                await locationService.sync(coords);
            } else {
                locationService.cacheLocation(coords);
            }

            return coords;
        } catch {
            set({ hasValidLocation: false });
            return null;
        } finally {
            set({ loading: false });
        }
    },

    async refreshLocation() {
        const { coordinates } = get();

        const hasValidCurrentLocation = isValidLocation(coordinates);
        if (hasValidCurrentLocation && !locationService.isCacheExpired()) {
            return;
        }

        // Trigger a fresh location request.
        await get().requestLocation();
    },

    clearLocation() {
        clearStoredLocation();

        set({
            coordinates: null,
            lastUpdated: null,
            hasCachedLocation: false,
            hasValidLocation: false,
        });
    },
}));
import { create } from "zustand";

// Services and Storage
import { locationService } from "@/lib/location/service";
import { clearStoredLocation } from './../lib/location/storage';

interface LocationStore extends LocationState {
    hasCachedLocation: boolean;

    initialize: () => Promise<void>;
    requestLocation: () => Promise<Coordinates | null>;
    refreshLocation: () => Promise<void>;
    clearLocation: () => void;

    setPermission: (permission: LocationPermission) => void;
}

export const useLocationStore = create<LocationStore>((set, get) => ({
    hasCachedLocation: false,
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
            set({
                coordinates: cached.coords,
                lastUpdated: cached.timestamp,
                hasCachedLocation: true,
            });
        }

        // Automatically refresh if already granted.
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
            set({
                coordinates: coords,
                lastUpdated: Date.now(),
                permission: "granted",
                hasCachedLocation: true,
            });

            if (locationService.shouldSync(coords)) {
                await locationService.sync(coords);
            } else {
                locationService.cacheLocation(coords);
            }
            return coords;
        } catch {
            return null;
        } finally {
            set({ loading: false });
        }
    },

    async refreshLocation() {
        if (!locationService.isCacheExpired()) {
            return;
        }
        await get().requestLocation();
    },

    clearLocation() {
        clearStoredLocation();
        set({
            coordinates: null,
            lastUpdated: null,
            hasCachedLocation: false,
        });
    },
}));
const STORAGE_KEY = "app:user-location";
const STORAGE_VERSION = 2;

interface StoredLocationPayload {
    version: number;
    data: StoredLocation;
}

// Check supplied value is a valid Coordinates object.
const isValidCoordinates = (
    value: unknown
): value is Coordinates => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const coords = value as Coordinates;

    return (
        typeof coords.latitude === "number" &&
        Number.isFinite(coords.latitude) &&
        coords.latitude >= -90 &&
        coords.latitude <= 90 &&

        typeof coords.longitude === "number" &&
        Number.isFinite(coords.longitude) &&
        coords.longitude >= -180 &&
        coords.longitude <= 180 &&

        typeof coords.accuracy === "number" &&
        Number.isFinite(coords.accuracy) &&
        coords.accuracy >= 0
    );
};

// Retrieves the cached location from localStorage.
export const getStoredLocation = (): StoredLocation | null => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return null;
        }

        const payload = JSON.parse(
            raw
        ) as StoredLocationPayload;

        if (
            payload.version !== STORAGE_VERSION ||
            !payload.data ||
            !isValidCoordinates(payload.data.coords) ||
            typeof payload.data.timestamp !== "number" ||
            !Number.isFinite(payload.data.timestamp)
        ) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        return payload.data;
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
};

// Saves the user's location locally.
export const saveStoredLocation = (
    coords: Coordinates
): StoredLocation => {
    const data: StoredLocation = {
        coords: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
        },
        timestamp: Date.now(),
    };

    const payload: StoredLocationPayload = {
        version: STORAGE_VERSION,
        data,
    };

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(payload)
        );
    } catch {
        // Ignore localStorage quota/access errors.
    }

    return data;
};

// Removes any cached location.
export const clearStoredLocation = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Ignore
    }
};
const STORAGE_KEY = "app:user-location";
const STORAGE_VERSION = 1;

interface StoredLocationPayload {
  version: number;
  data: StoredLocation;
}

// Check supplied value is a valid Coordinates object.
const isValidCoordinates = (value: unknown): value is Coordinates => {
  if (!value || typeof value !== "object") return false;

  const coords = value as Coordinates;

  return (
    typeof coords.latitude === "number" &&
    Number.isFinite(coords.latitude) &&
    typeof coords.longitude === "number" &&
    Number.isFinite(coords.longitude)
  );
};

// Retrieves the cached location from localStorage.
export const getStoredLocation = (): StoredLocation | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const payload = JSON.parse(raw) as StoredLocationPayload;

    if (
      payload.version !== STORAGE_VERSION ||
      !payload.data ||
      !isValidCoordinates(payload.data.coords) ||
      typeof payload.data.timestamp !== "number"
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
export const saveStoredLocation = (coords: Coordinates): StoredLocation => {

  const data: StoredLocation = {
    coords,
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
    // Ignore storage quota errors.
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
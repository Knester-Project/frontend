const LOCATION_KEY = "user_location";

export const getStoredLocation = (): StoredLocation | null => {
  try {
    const data = localStorage.getItem(LOCATION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveLocation = (coords: Coordinates) => {
  try {
    const payload: StoredLocation = {
      coords,
      timestamp: Date.now(),
    };

    localStorage.setItem(LOCATION_KEY, JSON.stringify(payload));
  } catch {
    // Silently ignore storage errors
  }
};
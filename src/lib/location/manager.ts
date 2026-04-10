import { useCallback, useRef, useEffect } from "react";
import { getStoredLocation, saveLocation } from "./storage";

// Services
import { updateProfile } from "@/services/api.services";


const SIX_HOURS = 6 * 60 * 60 * 1000;

export const useLocationManager = () => {

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Clean up the timeout if the component unmounts
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // Check if the user has moved significantly
    const hasMovedSignificantly = (oldCoords: Coordinates, newCoords: Coordinates) => {
        const diff =
            Math.abs(oldCoords.latitude - newCoords.latitude) +
            Math.abs(oldCoords.longitude - newCoords.longitude);
        return diff > 0.001;
    };

    // Send Coordinated to backend
    const sendLocationToBackend = useCallback((coords: Coordinates) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            updateProfile({ location: coords }).catch((err) => {
                console.error("Location update failed", err);
            });
        }, 1500);
    }, []);

    const ensureFreshLocation = useCallback(async (): Promise<Coordinates | null> => {
        
        if (typeof window === "undefined" || !navigator.geolocation) {
            return null;
        }

        const stored = getStoredLocation();
        const isExpired = !stored || Date.now() - stored.timestamp > SIX_HOURS;

        if (!isExpired && stored) {
            return stored.coords;
        }

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coords: Coordinates = {
                        longitude: pos.coords.longitude,
                        latitude: pos.coords.latitude,
                    };

                    saveLocation(coords);

                    if (!stored || hasMovedSignificantly(stored.coords, coords)) {
                        sendLocationToBackend(coords);
                    }

                    resolve(coords);
                },
                () => {
                    resolve(stored?.coords || null);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 10000,
                }
            );
        });
    }, [sendLocationToBackend]);

    return { ensureFreshLocation };
};
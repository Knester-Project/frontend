const STORAGE_KEY = "knester:last-route";

const DEFAULT_ROUTE = "/feed";
const MAX_ROUTE_AGE = 24 * 60 * 60 * 1000;

type SavedRoute = {
    path: string;
    savedAt: number;
}

// Routes that should be restored
const RESTORABLE_ROUTE_PREFIXES = [
    "/onboarding",
    "/features",
    "/guidelines",
    "/feed",
    "/market",
    "/people",
    "/safety",
    "/post/",
    "/profile",
    "/messages",
    "/notifications",
    "/search",
];

// Determines whether a route can be restored.
export function isRestorableRoute(pathname: string): boolean {
    return RESTORABLE_ROUTE_PREFIXES.some(
        (prefix) =>
            pathname === prefix ||
            pathname.startsWith(prefix),
    );
}


// Save the current route.
export function saveLastRoute(
    pathname: string,
    search: string = "",
    hash: string = "",
): void {
    if (!isRestorableRoute(pathname)) {
        return;
    }

    const savedRoute: SavedRoute = {
        path: `${pathname}${search}${hash}`,
        savedAt: Date.now(),
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(savedRoute),
    );
}


// Retrieve the previously saved route.
export function getLastRoute(): string {

    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return DEFAULT_ROUTE;

    try {
        const saved: SavedRoute = JSON.parse(raw);
        const age = Date.now() - saved.savedAt;

        if (age > MAX_ROUTE_AGE) {
            localStorage.removeItem(
                STORAGE_KEY,
            );
            return DEFAULT_ROUTE;
        }

        const url = new URL(
            saved.path,
            window.location.origin,
        );

        if (!isRestorableRoute(url.pathname)) {
            return DEFAULT_ROUTE;
        }
        return saved.path;
    } catch {
        localStorage.removeItem(STORAGE_KEY,);
        return DEFAULT_ROUTE;
    }
}


// Clear the saved route.
export function clearLastRoute(): void {
    localStorage.removeItem(STORAGE_KEY);
}
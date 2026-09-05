import { useEffect, useRef } from "react";
import { useRouter } from "@tanstack/react-router";

// Utils
import { getLastRoute } from "@/utils/route-persistence";
import { isRunningAsPWA } from "@/utils/pwa";

export default function RestoreLastRoute() {
    const router = useRouter();
    const hasRestored = useRef(false);

    useEffect(() => {
        if (hasRestored.current) return;
        hasRestored.current = true;

        if (!isRunningAsPWA()) {
            return;
        }

        const currentPath = router.state.location.pathname;

        if (currentPath !== "/") {
            return;
        }

        const lastRoute = getLastRoute();

        if (lastRoute === "/") {
            return;
        }

        router.navigate({
            to: lastRoute,
            replace: true,
        });
    }, [router]);

    return null;
}
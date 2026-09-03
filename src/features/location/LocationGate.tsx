import { type ReactNode, useEffect } from "react";

// Store
import { useLocationStore } from "@/stores/location.store";

// UI
import { PermissionScreen } from "./LocationPerm";

export function LocationGate({ children }: { children: ReactNode }) {

    const { initialized, initializing, hasValidLocation, permission, initialize } = useLocationStore();
    console.log("Has Valid Location", hasValidLocation, "Permission", permission, "Initialized", initialized);

    useEffect(() => {
        void initialize();
    }, [initialize]);

    if (!initialized || initializing) {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-background">
                <div className="space-y-4 text-center">
                    <div className="mx-auto border-4 border-primary border-t-transparent rounded-full size-8 md:size-9 xl:size-10 animate-spin" />
                    <p className="text-[11px] text-muted-foreground md:text-xs xl:text-sm">
                        Preparing your experience...
                    </p>
                </div>
            </div>
        );
    }

    if (permission === "unsupported") {
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-background px-6">
                <div className="max-w-xl text-center">
                    <h1 className="font-bold text-lg sm:text-xl md:text-2xl xl:text-3xl">
                        Browser Not Supported
                    </h1>

                    <p className="mt-4 text-muted-foreground">
                        Your browser does not support Geolocation.
                        Please use a modern browser like Chrome,
                        Edge, or Safari.
                    </p>
                </div>
            </div>
        );
    }

    if (hasValidLocation) {
        return children;
    }

    return <PermissionScreen />;
}
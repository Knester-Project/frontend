// Store
import { useLocationStore } from "@/stores/location.store";

// UI
import { Button } from "@/components/ui/button";

// Icons
import { Location, LocationCross, Warning2 } from "iconsax-reactjs";

export function PermissionScreen() {

    const { permission, loading, requestLocation, } = useLocationStore();

    const isDenied = permission === "denied";

    return (
        <main className="z-[9999] fixed inset-0 flex justify-center items-center bg-background">
            <section className="px-6 w-full max-w-lg">

                <div className="bg-card shadow-sm p-4 md:p-6 xl:p-8 border border-border rounded-3xl text-card-foreground">
                    <div className="flex justify-center">
                        <div className="bg-primary/10 p-3 md:p-4 xl:p-5 rounded-full text-primary">
                            {isDenied ? (
                                <LocationCross className="size-8 md:size-10 xl:size-12" />
                            ) : (
                                <Location className="size-8 md:size-10 xl:size-12" />
                            )}
                        </div>
                    </div>

                    <h1 className="mt-6 font-bold text-lg sm:text-xl md:text-2xl xl:text-3xl text-center">
                        {isDenied
                            ? "Location Permission Denied"
                            : "Enable Your Location"}
                    </h1>

                    <p className="mt-4 text-card-foreground/70 text-center leading-relaxed">
                        {isDenied
                            ? "Location access is currently blocked. Please enable location permission in your browser settings to continue using the application."
                            : "We use your location to show nearby people, personalize your feed, improve recommendations, and deliver a better overall experience."}
                    </p>

                    {!isDenied && (
                        <Button
                            className="mt-8 w-full h-11"
                            disabled={loading}
                            onClick={requestLocation}
                        >
                            {loading
                                ? "Requesting Location..."
                                : "Enable Location"}
                        </Button>
                    )}

                    {isDenied && (
                        <section className="bg-yellow-500/10 mt-8 p-2 md:p-3 xl:p-4 border border-yellow-500/20 rounded-xl">

                            <div className="flex items-start gap-3">
                                <Warning2 className="size-4 md:size-4.5 xl:size-5 text-yellow-500 shrink-0" />

                                <div className="space-y-2 smallText">
                                    <p className="font-semibold">
                                        How to enable location
                                    </p>
                                    <ol className="space-y-1 pl-3 md:pl-4 xl:pl-5 text-muted-foreground list-decimal">
                                        <li> Click the padlock icon beside the address bar. </li>
                                        <li> Open <strong>Site Settings</strong>.</li>
                                        <li> Change <strong>Location</strong> to <strong>Allow</strong>. </li>
                                        <li> Refresh the page.</li>
                                    </ol>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </section>
        </main>
    );
}
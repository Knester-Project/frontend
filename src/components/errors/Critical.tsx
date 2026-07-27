// UIs
import { Button } from "@/components/ui/button";

// Icons
import { AlertCircle } from "lucide-react";

export default function Critical(
    { ctaFn, onCancel, title, description, ctaTxt }:
        { ctaFn: () => void, onCancel: () => void, title: string, description: string, ctaTxt: string }
) {
    return (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-background/40 p-4 md:p-5 xl:p-6">
            <div className="bg-card shadow-2xl p-4 md:p-6 xl:p-8 rounded-2xl w-full max-w-sm text-center">
                {/* Icon */}
                <div className="flex justify-center items-center bg-primary/15 mx-auto mb-5 rounded-full size-10 md:size-12 xl:size-14">
                    <AlertCircle className="size-5 md:size-6 xl:size-7 text-primary" />
                </div>

                {/* Title */}
                <h2 className="mb-2 font-bold text-foreground text-base md:text-lg xl:text-xl">
                    {title}
                </h2>

                {/* Description */}
                <p className="mb-6 text-muted-foreground leading-relaxed">
                    {description}
                </p>

                {/* Primary CTA */}
                <Button onClick={ctaFn} className="bg-primary hover:bg-primary/90 mb-3 py-2.5 rounded-full w-full font-medium text-primary-foreground">
                    {ctaTxt}
                </Button>

                {/* Secondary */}
                <button onClick={onCancel} className="font-medium text-foreground hover:underline underline-offset-4 transition-all cursor-pointer">
                    Cancel and Exit
                </button>
            </div>
        </div>
    );
}
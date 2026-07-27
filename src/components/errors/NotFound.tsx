import { useNavigate } from "@tanstack/react-router";

// UIs
import { Button } from "@/components/ui/button";

export default function NotFound({ onReport, description }: { onReport: () => void, description: string }) {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-center items-center bg-gradient-to-b from-primary/5 to-background px-6 min-h-[80vh]">
            {/* Icon */}
            <div className="flex justify-center items-center bg-primary/10 mb-8 rounded-full size-20 md:size-24 xl:size-28">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="text-primary">
                    <path
                        d="M28 8C16.954 8 8 16.954 8 28s8.954 20 20 20 20-8.954 20-20S39.046 8 28 8z"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                    />
                    <path
                        d="M20 20l16 16M36 20L20 36"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {/* Title */}
            <h1 className="mb-3 font-bold text-2xl md:text-3xl xl:text-4xl text-center montserrat">
                Lost in the Warmth?
            </h1>

            {/* Description */}
            <p className="mb-8 max-w-md text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                {description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <Button onClick={() => navigate({ to: "/feed" })} className="bg-primary hover:bg-primary/90 px-6 py-2.5 rounded-full font-medium text-primary-foreground">
                    Return to Feed
                </Button>
                <button onClick={onReport} className="font-medium text-primary hover:underline underline-offset-4 transition-all cursor-pointer">
                    Report Issue
                </button>
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";

// Icons
import { BadgeAlert, CircleCheckBig, X } from "lucide-react";


export default function ToastInline({ title, message, variant = "error", duration = 10000, handleClose }: ToastInline) {

    const [progress, setProgress] = useState<number>(100);

    const styles = {
        error: {
            container: "bg-red-50 border-red-200",
            icon: "text-red-500",
            title: "text-red-700",
            message: "text-red-600",
            bar: "bg-red-400",
            Icon: BadgeAlert,
            defaultTitle: "Something went wrong",
        },
        success: {
            container: "bg-green-50 border-green-200",
            icon: "text-green-500",
            title: "text-green-700",
            message: "text-green-600",
            bar: "bg-green-400",
            Icon: CircleCheckBig,
            defaultTitle: "Success",
        },
    };

    const current = styles[variant];
    const Icon = current.Icon;

    // Countdown logic
    useEffect(() => {
        const start = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const percent = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(percent);

            if (elapsed >= duration) {
                handleClose();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [duration, handleClose]);


    return (
        <div className={`relative overflow-hidden flex items-start gap-x-2 shadow-sm my-4 px-4 py-2 border rounded-2xl ${current.container}`}>
            {/* Progress bar */}
            <div className="bottom-0 left-0 absolute bg-black/5 w-full h-1">
                <div className={`h-full transition-all duration-100 ${current.bar}`} style={{ width: `${progress}%` }} />
            </div>

            {/* Icon */}
            <div className={`flex-shrink-0 ${current.icon}`}>
                <Icon className="size-4" />
            </div>

            {/* Content */}
            <div className="flex-1 pr-6">
                <h4 className={`font-semibold ${current.title}`}>
                    {title || current.defaultTitle}
                </h4>
                <p className={`mt-1 smallText capitalize ${current.message}`}>
                    {message}
                </p>
            </div>

            {/* Close button */}
            <button onClick={handleClose} className="top-2 right-2 absolute text-black hover:text-destructive transition cursor-pointer" aria-label="Close">
                <X className="size-4" />
            </button>
        </div>
    );
}
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Utils
import { getTimeLeft } from "@/utils/socket";

// Icons
import { Cake, type Icon } from "iconsax-reactjs";

type ComingSoonProps = {
    title?: string;
    description?: string;
    launchDate: Date;
    Icon: Icon;
    compact?: boolean
}
export default function ComingSoon({
    title = "Coming Soon",
    description = "We're still building this. Check back shortly!",
    launchDate,
    Icon,
    compact = false,
}: ComingSoonProps) {

    const [timeLeft, setTimeLeft] = useState(launchDate ? getTimeLeft(launchDate) : null);

    useEffect(() => {
        if (!launchDate) return;
        const tick = () => setTimeLeft(getTimeLeft(launchDate));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [launchDate]);

    const units = timeLeft
        ? [
            { label: "Days", value: timeLeft.days },
            { label: "Hrs", value: timeLeft.hours },
            { label: "Min", value: timeLeft.minutes },
            { label: "Sec", value: timeLeft.seconds },
        ]
        : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center text-center rounded-3xl border-2 border-dashed border-border bg-muted/30 ${compact ? "py-10 px-6" : "py-20 px-6"}`}
        >
            <div className="flex items-center justify-center size-10 md:size-12 xl:size-14 rounded-2xl bg-primary/10 mb-4">
                {Icon ? <Icon className="size-5 md:size-6 xl:size-7 text-primary" /> : <Cake className="size-5 md:size-6 xl:size-7 text-primary" />}
            </div>
            <h3 className="font-bold text-foreground">{title}</h3>
            <p className="text-[11px] md:text-xs xl:text-sm text-muted-foreground mt-1 max-w-xs">{description}</p>

            {/* Countdown */}
            {timeLeft && (
                <div className="mt-6">
                    {timeLeft.past ? (
                        <span className="text-[10px] md:text-[11px] xl:text-xs font-semibold text-primary bg-amber-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
                            Launch date reached — coming any moment!
                        </span>
                    ) : (
                        <div className="flex items-center gap-2">
                            {units.map((u, i) => (
                                <div key={u.label} className="flex items-center gap-2">
                                    <div className="flex flex-col items-center">
                                        <span className="text-base md:text-lg xl:text-xl font-bold tabular-nums min-w-[2ch] text-center montserrat">
                                            {String(u.value).padStart(2, "0")}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{u.label}</span>
                                    </div>
                                    {i < units.length - 1 && <span className="text-lg font-bold text-muted-foreground/40">:</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
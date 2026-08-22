import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Utils and Services
import { useServerTime } from "@/services/userQueries";

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

    const { data } = useServerTime();
    const serverOffset = data?.serverTime ? new Date(data.serverTime).getTime() - Date.now() : 0;

    const [timeLeft, setTimeLeft] = useState(() =>
        getTimeLeft(launchDate, Date.now() + serverOffset)
    );

    function getTimeLeft(target: Date, now: number = Date.now()) {

        const total = target.getTime() - now;

        if (total <= 0) {
            return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
        }

        return {
            total,
            days: Math.floor(total / (1000 * 60 * 60 * 24)),
            hours: Math.floor((total / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((total / (1000 * 60)) % 60),
            seconds: Math.floor((total / 1000) % 60),
            past: false,
        };
    }

    useEffect(() => {
        const tick = () => {
            setTimeLeft(
                getTimeLeft(launchDate, Date.now() + serverOffset)
            );
        };

        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [launchDate, serverOffset]);


    const units = timeLeft ? [
        { label: "Days", value: timeLeft.days },
        { label: "Hrs", value: timeLeft.hours },
        { label: "Min", value: timeLeft.minutes },
        { label: "Sec", value: timeLeft.seconds },
    ] : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center text-center h-[85vh] rounded-3xl border-2 border-dashed border-accent/10 bg-accent/10 ${compact ? "py-10 px-6" : "py-20 px-6"}`}
        >
            <div className="flex justify-center items-center bg-primary/10 mb-4 rounded-lg size-10 md:size-12 xl:size-14">
                {Icon ? <Icon className="size-7 md:size-8 xl:size-9 text-primary" variant="Bold" /> : <Cake variant="Bold" className="size-7 md:size-8 xl:size-9 text-primary" />}
            </div>
            <h3 className="font-bold text-foreground text-lg md:text-xl xl:text-2xl">{title}</h3>
            <p className="mt-1 max-w-xs text-accent-foreground/70 smallText">{description}</p>

            {/* Countdown */}
            {timeLeft && (
                <div className="mt-6">
                    {timeLeft.past ? (
                        <span className="bg-amber-primary/10 px-3 py-1.5 border border-primary/20 rounded-full font-semibold text-[10px] text-primary md:text-[11px] xl:text-xs">
                            Launch date reached — coming any moment!
                        </span>
                    ) : (
                        <div className="flex items-center gap-2">
                            {units.map((u, i) => (
                                <div key={u.label} className="flex items-center gap-2">
                                    <div className="flex flex-col items-center bg-accent p-3 rounded-lg">
                                        <span className="min-w-[2ch] font-bold tabular-nums text-base md:text-lg xl:text-xl text-center montserrat">
                                            {String(u.value).padStart(2, "0")}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-wide text-accent-foreground">{u.label}</span>
                                    </div>
                                    {i < units.length - 1 && <span className="font-bold text-muted-foreground/40 text-lg">:</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
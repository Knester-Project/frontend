import { motion } from "framer-motion";

// Utils
import { cn } from "@/lib/utils";

// Icons
import { TickCircle, Clock } from "iconsax-reactjs";


const STATUS_CONFIG = {
    available: {
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        icon: TickCircle,
        label: "Available",
    },
    development: {
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        icon: Clock,
        label: "In Development",
    },
    pending: {
        badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        icon: Clock,
        label: "Pending Launch",
    },
};

type FeatureCardProps = {
    title: string;
    description: string;
    status: "available" | "development" | "pending";
    usage?: string;
    launchDate?: string;
    index: number;
}

export default function FeatureCard({ title, description, status = "available", usage, launchDate, index = 0 }: FeatureCardProps) {

    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: index * 0.05, duration: 0.25 }}
            className="bg-card shadow hover:shadow-md p-4 md:p-5 xl:p-6 border border-border rounded-2xl transition-shadow"
        >
            <section>
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold">{title}</h4>
                    </div>
                    <span className={cn("inline-flex flex-shrink-0 items-center gap-1 px-2 py-1 border rounded-full font-bold text-[10px] md:text-[11px] xl:text-xs uppercase tracking-wider", config.badge)}>
                        <Icon className="size-3 md:size-3.5 xl:size-4" />
                        {config.label}
                    </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground md:text-xs xl:text-sm leading-relaxed">{description}</p>
            </section>

            {/* Usage info */}
            {usage && (
                <div className="mt-3 pt-3 border-border border-t">
                    <p className="mb-1 font-semibold text-[9px] text-muted-foreground md:text-[10px] xl:text-[11px] uppercase tracking-wider">How to use</p>
                    <p className="text-[11px] text-muted-foreground md:text-xs xl:text-sm leading-relaxed">{usage}</p>
                </div>
            )}

            {/* Launch date */}
            {launchDate && (
                <div className="mt-3 pt-3 border-border border-t">
                    <p className="mb-1 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">Expected Launch</p>
                    <p className="font-medium text-muted-foreground text-xs">{launchDate}</p>
                </div>
            )}
        </motion.div>
    );
}
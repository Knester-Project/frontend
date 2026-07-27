import { motion } from "framer-motion";

// Assets
import { AVAILABLE_FEATURES, FUTURE_FEATURES, UPCOMING_FEATURES } from "@/assets/features";

// UIs
import FeatureCard from "./FeatureCard";

// Icons
import { Clock, LampCharge, Layer, TickCircle, type Icon } from "iconsax-reactjs";
import { Rocket } from "lucide-react";

type HeaderProps = {
    Icon: Icon;
    title: string;
    subtitle: string;
    count: number;
}

function SectionHeader({ Icon, title, subtitle, count }: HeaderProps) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className="flex flex-shrink-0 justify-center items-center bg-primary/10 rounded-md size-8 md:size-9 xl:size-10">
                <Icon className="size-4 md:size-4.5 xl:size-5 text-primary" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h2 className="font-bold">{title}</h2>
                    {count != null && (
                        <span className="bg-muted px-2 py-0.5 rounded-full font-bold text-muted-foreground text-xs">{count}</span>
                    )}
                </div>
                <p className="text-[11px] text-muted-foreground md:text-xs xl:text-sm">{subtitle}</p>
            </div>
        </div>
    );
}

function Features() {

    return (
        <main>
            {/* Intro */}
            <div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-primary/10 to-primary/5 p-5 border border-primary/20 rounded-2xl"
                >
                    <div className="flex items-start gap-3">
                        <div className="flex flex-shrink-0 justify-center items-center bg-primary/15 rounded-2xl w-11 h-11">
                            <Layer className="size-4 md:size-4.5 xl:size-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-bold">Everything on Knester</h2>
                            <p className="mt-1 text-[11px] text-muted-foreground md:text-xs xl:text-sm leading-relaxed">
                                Explore what's live today, what's coming soon, and what's on our future roadmap.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Available features */}
            <div className="mt-6">
                <SectionHeader
                    Icon={TickCircle}
                    title="Available Now"
                    subtitle="These features are ready to use right now"
                    count={AVAILABLE_FEATURES.length}
                />
                <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
                    {AVAILABLE_FEATURES.map((f, i) => (
                        <FeatureCard key={f.title} {...f} status="available" index={i} />
                    ))}
                </div>
            </div>

            {/* Upcoming features */}
            <div className="mt-8">
                <SectionHeader
                    Icon={Clock}
                    title="Coming Soon"
                    subtitle="In active development or pending launch"
                    count={UPCOMING_FEATURES.length}
                />
                <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
                    {UPCOMING_FEATURES.map((f, i) => (
                        <FeatureCard key={f.title} {...f} status={f.status as "development" | "pending" | "available"} index={i} />
                    ))}
                </div>
            </div>

            {/* Future roadmap */}
            <div className="mt-8">
                <SectionHeader
                    Icon={LampCharge}
                    title="On the Future Roadmap"
                    subtitle="Features we're exploring for later releases"
                    count={FUTURE_FEATURES.length}
                />
                <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
                    {FUTURE_FEATURES.map((f, i) => (
                        <FeatureCard
                            key={f.title}
                            title={f.title}
                            description={f.description}
                            status="pending"
                            index={i}
                        />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-2.5 px-1 pb-4"
                >
                    <Rocket className="flex-shrink-0 mt-0.5 size-3 md:size-3.5 xl:size-4 text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground md:text-[11px] xl:text-xs leading-relaxed">
                        Feature availability and timelines may change. We prioritise security and stability above all else —
                        thank you for being part of the CircleSync community.
                    </p>
                </motion.div>
            </div>
        </main>
    );
}

export default Features;
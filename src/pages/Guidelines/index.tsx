import { motion } from "framer-motion";

// Assets
import { DONTS, DOS, SECURITY_TIPS, VIOLATION_INFO } from "@/assets/guidelines";

// UI
import GuidelineSection from "./GuidelinesCard";

// Icons
import { Danger, Eye, Flag, Lock, ShieldSecurity } from "iconsax-reactjs";

export default function Guidelines() {

    return (
        <main>

            {/* Header */}
            <header className="top-0 z-5 sticky flex items-center gap-3 bg-card/80 backdrop-blur-lg py-3">
                <div className="flex items-center gap-2">
                    <ShieldSecurity className="size-5 md:size-5.5 xl:size-6 text-primary" />
                    <h1 className="font-bold text-lg md:text-xl xl:text-2xl">Community Guidelines</h1>
                </div>
            </header>

            {/* Intro */}
            <div className="pt-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-primary/10 to-primary/5 p-5 border border-primary/20 rounded-2xl"
                >
                    <div className="flex items-start gap-3">
                        <div className="flex flex-shrink-0 justify-center items-center bg-primary/15 rounded-2xl size-10 md:size-11 xl:size-12">
                            <Lock className="size-5 md:size-5.5 xl:size-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-bold">Your safety comes first</h2>
                            <p className="mt-1 text-[11px] text-muted-foreground md:text-xs xl:text-sm leading-relaxed">
                                Knester is a social platform built with security at its core. These guidelines exist to protect
                                you and everyone in your circle. By using the app, you agree to follow them.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Do's */}
            <div className="space-y-4 mt-4">
                <GuidelineSection
                    title="What you should do"
                    variant="do"
                    Icon={ShieldSecurity}
                    items={DOS}
                    index={0}
                />

                {/* Don'ts */}
                <GuidelineSection
                    title="What you shouldn't do"
                    variant="dont"
                    Icon={Danger}
                    items={DONTS}
                    index={1}
                />

                {/* Security tips */}
                <GuidelineSection
                    title="Protect your account"
                    variant="info"
                    Icon={Lock}
                    items={SECURITY_TIPS}
                    index={2}
                />

                {/* Reporting */}
                <GuidelineSection
                    title="Reporting violations"
                    variant="info"
                    Icon={Flag}
                    items={VIOLATION_INFO}
                    index={3}
                />

                {/* Footer note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-2.5 px-1 pt-2 pb-4"
                >
                    <Eye className="flex-shrink-0 mt-0.5 size-3 md:size-3.5 xl:size-4 text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground md:text-[11px] xl:text-xs leading-relaxed">
                        These guidelines may be updated at any time. Continued use of Knester after changes means you've
                        agreed to the updated terms. If you see something that doesn't look right, trust your instincts and
                        report it.
                    </p>
                </motion.div>
            </div>
        </main>
    );
}

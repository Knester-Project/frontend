import { motion } from "framer-motion";

// Utils
import { cn } from "@/lib/utils";
import { formatDist } from "@/utils/format";


const MARKS = [1, 62.5, 125, 187.5, 250];

// Define the props interface
export interface DistanceSliderProps {
    value: number;
    onChange: (value: number) => void;
}

export default function DistanceSlider({ value, onChange }: DistanceSliderProps) {

    const max = 250;
    // Ensure the percentage doesn't exceed 100% just in case value is greater than max
    const pct = Math.min((value / max) * 100, 100);

    const color =
        value <= 75 ? "oklch(0.731 0.178 48.687)" :
            value <= 150 ? "#43A047" :
                "#E53935";

    return (
        <main className="space-y-3">
            <div className="flex justify-between items-center">
                <p className="font-medium">Search radius</p>
                <motion.span key={value} initial={{ scale: 0.85, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }}
                    style={{ color }} className="font-bold smallText montserrat">
                    {formatDist(value)}
                </motion.span>
            </div>

            {/* Track + thumb */}
            <div className="relative pt-1 pb-4">
                <div className="relative bg-muted rounded-full h-2 overflow-hidden">
                    <div className="left-0 absolute inset-y-0 rounded-full transition-all duration-150"
                        style={{ width: `${pct}%`, background: color }} />
                </div>
                <input type="range" min={1} max={max} value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />

                {/* Marks */}
                <div className="relative flex justify-between mt-3">
                    {MARKS.map((m) => (
                        <button key={m} onClick={() => onChange(m)}
                            className={cn("outline-0 ring-0 font-medium text-[10px] md:text-[11px] xl:text-xs duration-300 cursor-pointer montserrat",
                                value === m ? "text-primary font-bold" : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                            )}>
                            {m < 1000 ? `${m}km` : `${m / 1000}k`}
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
}
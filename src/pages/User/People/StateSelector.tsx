import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Assets and Utils
import { NIGERIAN_STATES } from "@/assets/states";
import { cn } from "@/lib/utils";

// Icons
import { Search, X } from "lucide-react";
import { DirectDown, Location } from "iconsax-reactjs";

const PINNED = ["Lagos", "Enugu", "FCT Abuja", "Rivers", "Kano", "Oyo"];

export default function StateSelector({selected, setSelected}: {selected: string | null, setSelected: (stateName: string) => void}) {

    const [open, setOpen] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    

    // Filter using object properties
    const filtered = NIGERIAN_STATES.filter((s) =>
        `${s.name} ${s.capital}`
            .toLowerCase()
            .includes(query.toLowerCase())
    );

    const toggle = (stateName: string) => {
        setSelected(stateName)
        setOpen(false);
        setQuery("");
    };

    return (
        <main className="relative">
            {/* Trigger */}
            <button onClick={() => setOpen((v) => !v)} className={cn("flex items-center gap-2 px-4 py-3 border rounded-2xl w-full font-medium transition-all cursor-pointer smallText", selected ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-card-foreground hover:border-primary/30")}>

                <Location className="size-4 shrink-0" />
                <span className="flex-1 text-left">
                    {selected || "Select a state…"}
                </span>

                {selected ? (
                    <button onClick={(e) => { e.stopPropagation(); setSelected("") }} className="hover:text-destructive transition-colors cursor-pointer">
                        <X className="size-4" />
                    </button>
                ) : (
                    <DirectDown className={cn("size-4 text-gray-600 dark:text-gray-300 transition-transform", open && "rotate-180")} />
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.18 }}
                        className="top-full right-0 left-0 z-50 absolute bg-card shadow-xl mt-2 border border-border rounded-2xl overflow-hidden">
                        {/* Search */}
                        <div className="flex items-center gap-2 px-3 py-2.5 border-border border-b">
                            <Search className="size-4 text-gray-600 dark:text-gray-300 shrink-0" />
                            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search states or capitals…"
                                className="flex-1 bg-transparent focus:outline-none text-[11px] placeholder:text-gray-600 md:text-xs xl:text-sm" autoFocus />
                        </div>

                        {/* Pinned */}
                        {!query && (
                            <div className="px-3 py-2 border-border/50 border-b">
                                <p className="mb-2 font-semibold text-[9px] text-gray-600 md:text-[10px] xl:text-[11px] dark:text-gray-300 uppercase tracking-widest">
                                    Popular
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {PINNED.map((s) => (
                                        <button key={s} onClick={() => toggle(s)}
                                            className={cn("px-2.5 py-1 border rounded-lg font-medium text-[10px] md:text-[11px] xl:text-xs transition-all cursor-pointer",
                                                selected === s ? "bg-primary text-primary-foreground border-primary"
                                                    : "border-border text-gray-600 dark:text-gray-300 hover:border-primary/40 hover:text-foreground")}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Full list */}
                        <div className="py-1 max-h-52 overflow-y-auto">
                            {filtered.length === 0 && (
                                <p className="py-4 text-[10px] text-gray-600 md:text-[11px] dark:text-gray-300 xl:text-xs text-center">
                                    No states found
                                </p>
                            )}

                            {filtered.map((s) => (
                                <button key={s.name} onClick={() => toggle(s.name)}
                                    className={cn("flex justify-between items-center px-4 py-2 w-full text-sm text-left transition-colors cursor-pointer",
                                        selected === s.name ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-accent/10")}>
                                    <span>{s.name}</span>
                                    <span className="text-[9px] text-gray-600 md:text-[10px] xl:text-[11px] dark:text-gray-300">
                                        {s.capital}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
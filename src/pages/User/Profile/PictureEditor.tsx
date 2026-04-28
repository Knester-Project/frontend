import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sileo } from "sileo";

// Utils, Assets and Services
import { cn } from "@/lib/utils";
import STYLES from "@/assets/styles";
import { useSyncProfile } from "@/services/userMutations";

// UIs
import { Button } from "@/components/ui/button";

// Icons
import { DirectDown, DirectUp, DirectLeft, GalleryTick, Shuffle, Slash, Refresh } from "iconsax-reactjs";
import { Rocket, X } from "lucide-react";


// Represents the configuration for a specific feature (like hair or eyes)
interface FeatureConfig {
    label: string;
    type: "color" | "swatch";
    values: string[];
}

// Represents a complete DiceBear style configuration
interface StyleConfig {
    id: string;
    label: string;
    options: Record<string, FeatureConfig>;
}

// Represents the user's selected parameters
interface AvatarParams {
    [key: string]: string;
}

// Props for the StylePicker component
interface StylePickerProps {
    selected: StyleConfig | null;
    onSelect: (style: StyleConfig) => void;
}

// Props for the FeatureOption component
interface FeatureOptionProps {
    optionKey: string;
    config: FeatureConfig;
    value: string;
    onChange: (value: string) => void;
    styleId: string;
    seed: string;
    params: AvatarParams;
}

// Props for the FeatureCustomizer component
interface FeatureCustomizerProps {
    style: StyleConfig;
    seed: string;
    onSeedChange: (seed: string) => void;
    params: AvatarParams;
    onParamChange: (key: string, value: string) => void;
}

// Props for the Main ProfilePictureEditor component
interface ProfilePictureEditorProps {
    onClose: () => void;
    isPremium: boolean;
}

// Functions
function buildUrl(styleId: string, seed: string, params: AvatarParams) {
    const base = `https://api.dicebear.com/9.x/${styleId}/svg`;
    const qs = new URLSearchParams({ seed });

    Object.entries(params).forEach(([k, v]) => {
        // Override the probability parameter to 0
        if (v === "none") {
            qs.set(`${k}Probability`, "0");
        }
        // Otherwise, add the parameter normally
        else if (v) {
            qs.set(k, v);
        }
    });

    return `${base}?${qs.toString()}`;
}

function randomSeed() {
    return Math.random().toString(36).slice(2, 10);
}


function StylePicker({ selected, onSelect }: StylePickerProps) {
    return (
        <div>
            <h3 className="mb-1 font-semibold">Choose a style</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300 text-xs">
                Pick the avatar style that fits you best.
            </p>
            <div className="gap-3 grid grid-cols-2">
                {STYLES.map((style: StyleConfig) => {
                    const previewUrl = buildUrl(style.id, "preview", {});
                    return (
                        <button key={style.id} type="button" onClick={() => onSelect(style)}
                            className={cn("group flex flex-col items-center gap-2 p-2 border-2 rounded-2xl transition-all cursor-pointer",
                                selected?.id === style.id ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border hover:border-primary/30 hover:bg-secondary/60"
                            )}>
                            <div className="flex justify-center items-center bg-secondary rounded-xl size-10 md:size-12 xl:size-14 overflow-hidden">
                                <img src={previewUrl} alt={style.label} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <span className="font-medium text-[10px] text-gray-600 md:text-[11px] dark:text-gray-300 md:text-xs leading-none">
                                {style.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// Customise Features
function FeatureOption({ optionKey, config, value, onChange, styleId, seed, params }: FeatureOptionProps) {
    const isColor = config.type === "color";

    // Add state to track if the section is expanded
    const [isExpanded, setIsExpanded] = useState(false);

    // Set how many items you want to show by default
    const VISIBLE_COUNT = 6;

    // Determine if we need a "View More" button and slice the array accordingly
    const hasMore = config.values.length > VISIBLE_COUNT;
    const visibleValues = isExpanded ? config.values : config.values.slice(0, VISIBLE_COUNT);

    return (
        <div>
            <p className="mb-2 font-semibold text-[11px] md:text-xs xl:text-sm">
                {config.label}
            </p>

            <div className="flex flex-wrap gap-2">
                {visibleValues.map((val) => {
                    const selected = value === val;
                    if (isColor) {
                        return (
                            <button key={val} type="button" title={`#${val}`} onClick={() => onChange(val)} style={{ background: `#${val}` }}
                                className={cn("border-2 rounded-2xl size-6 md:size-7 xl:size-8 transition-all cursor-pointer",
                                    selected ? "border-primary scale-110 shadow-md" : "border-transparent hover:scale-105"
                                )} />
                        )
                    }

                    if (val === "none") {
                        return (
                            <button key={val} type="button" onClick={() => onChange(val)}
                                className={cn(
                                    "flex justify-center items-center border rounded-xl size-8 md:size-9 xl:size-10 transition-all cursor-pointer",
                                    selected ? "border-primary bg-primary/10 text-primary scale-110 shadow-md"
                                        : "border-border bg-accent/40 hover:border-primary/40 text-gray-600 dark:text-gray-300"
                                )} title="None">
                                <Slash className="size-4 md:size-5" />
                            </button>
                        );
                    }

                    // Swatch: render mini avatar preview
                    const swatchParams = { ...params, [optionKey]: val };
                    const swatchUrl = buildUrl(styleId, seed, swatchParams);
                    return (
                        <button key={val} type="button" onClick={() => onChange(val)}
                            className={cn(
                                "flex justify-center items-center bg-accent/20 border rounded-xl size-8 md:size-9 xl:size-10 overflow-hidden transition-all cursor-pointer",
                                selected ? "border-primary scale-110 shadow-md shadow-primary/20" : "border-border hover:border-primary/40"
                            )}>
                            <img src={swatchUrl} alt={val} className="w-full h-full object-cover" loading="lazy" />
                        </button>
                    );
                })}
            </div>

            {/* The View More / View Less Toggle Button */}
            {hasMore && (
                <button type="button" onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1 mt-3 font-medium text-[10px] text-gray-600 md:text-[11px] hover:text-accent dark:text-gray-300 xl:text-xs transition-colors duration-200 cursor-pointer montserrat">
                    {isExpanded ? (
                        <>
                            View Less <DirectUp variant="Bold" className="size-3" />
                        </>
                    ) : (
                        <>
                            View {config.values.length - VISIBLE_COUNT} More <DirectDown variant="Bold" className="size-3" />
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

function FeatureCustomizer({ style, seed, onSeedChange, params, onParamChange }: FeatureCustomizerProps) {
    return (
        <div className="space-y-5">
            {/* Seed row */}
            <div>
                <p className="mb-2 font-semibold text-[11px] md:text-xs xl:text-sm">Seed</p>
                <div className="flex gap-x-2">
                    <input value={seed} onChange={(e) => onSeedChange(e.target.value)} placeholder="Enter any text…"
                        className="flex-1 bg-background px-3 py-2 border border-input rounded-xl focus:outline-none text-[11px] md:text-xs xl:text-sm" />
                    <Button type="button" variant="outline" size="icon" className="rounded-xl shrink-0" onClick={() => onSeedChange(randomSeed())}>
                        <Shuffle className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Per-option controls */}
            {Object.entries(style.options).map(([key, config]) => (
                <FeatureOption key={key} optionKey={key} config={config} value={params[key] ?? ""} onChange={(v) => onParamChange(key, v)}
                    styleId={style.id} seed={seed} params={params} />
            ))}
        </div>
    );
}

// Main Component
export default function ProfilePictureEditor({ onClose, isPremium }: ProfilePictureEditorProps) {

    const adventurerDefault = {
        "earringsProbability": "100",
        "featuresProbability": "100",
        "glassesProbability": "100",
    }

    const croodlesDefault = {
        "beardProbability": "100",
        "mustacheProbability": "100",
    }

    const toonHeadDefault = {
        "rearHairProbability": "100"
    }

    const adventurerNeutralDefault = {
        "glassesProbability": "100",
    }

    const [step, setStep] = useState<number>(1);
    const [selectedStyle, setSelectedStyle] = useState<StyleConfig | null>(null);
    const [seed, setSeed] = useState<string>(() => randomSeed());
    const [params, setParams] = useState<AvatarParams>({});

    const previewUrl = selectedStyle ? buildUrl(selectedStyle.id, seed, params) : null;

    const handleStyleSelect = (style: StyleConfig) => {
        if (!isPremium && (style.id === "croodles" || style.id === "toon-head")) {
            sileo.error({ title: "Style Not Available", description: "The selected style is only available to Premium users." })
            return;
        }
        setSelectedStyle(style);
        if (style.id === "croodles") {
            setParams(croodlesDefault)
        } else if (style.id === "adventurer") {
            setParams(adventurerDefault)
        } else if (style.id === "toon-head") {
            setParams(toonHeadDefault)
        } else if (style.id === "adventurer-neutral") {
            setParams(adventurerNeutralDefault)
        }
    };

    const handleParamChange = useCallback((key: string, value: string) => {
        setParams((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleNext = () => {
        if (step === 1 && selectedStyle) setStep(2);
    };

    const syncProfile = useSyncProfile()
    const handleConfirm = () => {
        if (selectedStyle && previewUrl) {
            syncProfile.mutate({ profilePicture: previewUrl }, {
                onSuccess: () => {
                    sileo.success({ title: "Profile Image Updated !!!", icon: <Rocket className="size-3.5" />, });
                    onClose();
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (error: any) => {
                    const message = error?.response?.data?.message || "Couldn't update profile now, kindly try again later.";
                    sileo.error({ title: "Error", description: message });
                },
            });
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-3 md:p-4 xl:p-5 border-border border-b">
                {step === 2 && (
                    <button type="button" onClick={() => setStep(1)} className="flex justify-center items-center hover:bg-accent rounded-lg size-7 md:size-8 xl:size-9 transition-colors duration-200 cursor-pointer">
                        <DirectLeft className="size-3.5 md:size-4 xl:size-4.5" />
                    </button>
                )}
                <div className="flex-1 montserrat">
                    <h2 className="font-bold">
                        {step === 1 ? "Choose Avatar Style" : `Customize · ${selectedStyle?.label}`}
                    </h2>
                    <p className="mt-0.5 text-[11px] text-gray-600 dark:text-gray-300">
                        Step {step} of 2
                    </p>
                </div>
                {onClose && (
                    <button type="button" onClick={onClose} className="flex justify-center items-center hover:bg-accent rounded-lg size-7 md:size-8 xl:size-9 transition-colors duration-200 cursor-pointer">
                        <X className="size-3.5 md:size-4 xl:size-4.5" />
                    </button>
                )}
            </div>

            {/* Body */}
            <div className="flex flex-1 gap-0">
                {/* Scrollable content */}
                <div className="flex-1 p-3 md:p-4 xl:p-5 overflow-y-auto hide-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="step1" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                                <StylePicker selected={selectedStyle} onSelect={handleStyleSelect} />
                            </motion.div>
                        ) : (
                            <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2 }}>
                                {selectedStyle && (
                                    <FeatureCustomizer style={selectedStyle} seed={seed} onSeedChange={setSeed} params={params} onParamChange={handleParamChange} />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Live preview panel (step 2 only) */}
                <AnimatePresence>
                    {step === 2 && previewUrl && (
                        <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 168 }} exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.25 }} className="flex flex-col justify-center items-center gap-3 bg-secondary/30 px-4 border-border border-l shrink-0">
                            <p className="font-semibold text-[10px] text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                Preview
                            </p>
                            <div className="bg-card shadow-md rounded-2xl size-20 md:size-24 xl:size-28 overflow-hidden">
                                <img key={previewUrl} src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                            <p className="text-[10px] text-gray-600 md:text-[11px] dark:text-gray-300 xl:text-xs text-center leading-relaxed">
                                Updates live as you choose features
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex gap-2 p-3 md:p-4 xl:p-5 border-border border-t">
                {step === 1 ? (
                    <Button className="flex-1 rounded-xl" disabled={!selectedStyle} onClick={handleNext}>
                        Next — Customize →
                    </Button>
                ) : (
                    <>
                        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(1)}>
                            Back
                        </Button>
                        <Button disabled={syncProfile.isPending} className="flex-1 gap-2 shadow-lg shadow-primary/20 rounded-xl" onClick={handleConfirm}>
                            {syncProfile.isPending ? <Refresh className="size-4 animate-spin" /> : <GalleryTick className="size-4" />}
                            {syncProfile.isPending ? "Saving..." : "Use this avatar"}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
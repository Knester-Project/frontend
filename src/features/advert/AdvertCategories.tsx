// Utils and Constants
import { cn } from "@/lib/utils";
import { ADVERT_CATEGORIES } from "@/assets/categories";

// Icons
import { CircleCheckBig } from "lucide-react";


interface CategorySelectorProps {
    selected: string[];
    onChange: (categories: string[]) => void;
    maxSelections?: number;
}

export default function CategorySelector({ selected, onChange, maxSelections = 10 }: CategorySelectorProps) {

    // Functions
    const toggleCategory = (category: string) => {
        if (selected.includes(category)) {
            onChange(selected.filter((item) => item !== category));
        } else {
            if (selected.length < maxSelections) {
                onChange([...selected, category]);
            }
        }
    };

    return (
        <div className="space-y-6">
            {Object.entries(ADVERT_CATEGORIES).map(([groupName, categories]) => (
                <div key={groupName} className="space-y-3">

                    <h4 className="flex items-center gap-2 font-bold text-[11px] text-foreground/90 md:text-xs xl:text-sm capitalize">
                        {groupName}
                        <span className="flex-1 ml-2 bg-border/40 h-px" />
                    </h4>

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => {
                            const isSelected = selected.includes(category);

                            return (
                                <button key={category} type="button" onClick={() => toggleCategory(category)}
                                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-[11px] md:text-xs transition-all duration-200 cursor-pointer",
                                        isSelected ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 ring-2 ring-primary/30"
                                            : "bg-accent/10 text-foreground/80 hover:bg-accent/20 border border-border/50 hover:border-primary/30"
                                    )}>
                                    {/* Show a tiny checkmark if selected for extra visual feedback */}
                                    {isSelected && <CircleCheckBig className="size-3" />}
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
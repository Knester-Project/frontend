import { useState } from "react";

// Assets
import { NIGERIAN_STATES } from "@/assets/states";

// Icons
import { ArrowDown2, SearchNormal1 } from "iconsax-reactjs";
import ErrorText from "@/components/ErrorText";

type StateSelectProps = {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

const StateSelect = ({ value, onChange, error, disabled }: StateSelectProps) => {

    const states: { name: string, capital: string }[] = NIGERIAN_STATES;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchState, setSearchState] = useState<string>("");


    // Functions
    const filteredStates = states.filter(s =>
        s.name.toLowerCase().includes(searchState.toLowerCase()) ||
        s.capital.toLowerCase().includes(searchState.toLowerCase())
    );

    return (
        <main className="relative">
            <label className="text-foreground cursor-pointer">
                State <span className="text-red-500"> *</span>
            </label>

            <div className="relative mt-1">
                <button type="button" disabled={disabled} onClick={() => setIsOpen((prev) => !prev)} className={`flex justify-between items-center bg-inherit px-4 py-3 border rounded-lg focus:outline-none w-full duration-300 cursor-pointer ${error ? "border-red-500" : "focus:border-primary"}`}>
                    <p>{value ?? "Select State"}</p>
                    <span className={`ml-auto transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
                        <ArrowDown2 size={16} variant="Bold" />
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute bg-background shadow-md mt-2 border rounded-lg w-full max-h-72 overflow-hidden">
                        <div className="flex items-center gap-2 bg-white dark:bg-black p-2 border-b">
                            <SearchNormal1 size={16} />
                            <input type="text" placeholder="Search State..." value={searchState} onChange={(e) => setSearchState(e.target.value)} className="px-2 py-1 focus:outline-none w-full" />
                        </div>
                        <ul className="max-h-60 overflow-y-auto">
                            {filteredStates.length > 0 ? (
                                filteredStates.map((state, index) => (
                                    <li key={`${state}-${index}`} onClick={() => { onChange(state.name); setIsOpen(false) }} className="flex items-center gap-2 hover:bg-accent px-4 py-2 duration-300 cursor-pointer">
                                        <p className="text-accent-foreground">{state.name}</p>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-3 text-sm text-center text-accent-foreground">
                                    No results found
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
            {error && <ErrorText message={error} />}
        </main>
    );
}

export default StateSelect;
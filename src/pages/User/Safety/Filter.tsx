import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/_dashboard/safety";

// Data and Stores
import { NIGERIAN_STATES } from "@/assets/states";

// UI
import { Card } from "@/components/ui/card";

// Icons
import { ChevronDown, X, MapPin } from "lucide-react"
import { AlignVertically, DocumentFilter, Map, TagUser } from "iconsax-reactjs"

export default function StateFilter() {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [advanced, setAdvanced] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const navigate = useNavigate({ from: Route.fullPath });

    const { state, city, street, name } = Route.useSearch()

    const toggleAdvanced = () => setAdvanced((prev) => !prev);
    const setSearchParam = <K extends "state" | "city" | "street" | "name">(key: K, value?: string) => {
        navigate({
            search: (prev) => {
                const next = { ...prev }
                if (!value) delete next[key]
                else next[key] = value
                return next
            },
        })
    }

    const filteredStates = NIGERIAN_STATES.filter(
        (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.capital.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Card className="lg:fixed relative bg-accent/20 dark:bg-accent/5 shadow-sm p-4 border-border rounded-3xl lg:w-[30%]">
            <div className="space-y-4">

                {/* ===== STATE FILTER ===== */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <MapPin className="size-4" />
                        <span className="font-medium text-xs">Filter by state</span>
                    </div>

                    {state && (
                        <div className="flex justify-between items-center bg-primary/10 px-4 py-2 rounded-full">
                            <span className="font-medium text-primary text-sm">{state}</span>
                            <button onClick={() => setSearchParam("state")} className="hover:bg-primary/20 p-1 rounded-full text-primary transition">
                                <X className="size-4" />
                            </button>
                        </div>
                    )}

                    <button onClick={() => setIsOpen((p) => !p)} className="flex justify-between items-center bg-linear-to-r from-primary/10 hover:from-primary/20 to-primary/20 hover:to-primary/40 px-4 py-2 border border-border rounded-full w-full text-sm transition cursor-pointer">
                        <span>{state ? "Change state" : "Select a state"}</span>
                        <ChevronDown className={`size-4 transition ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isOpen && (
                        <div className="top-full right-0 left-0 z-20 absolute bg-popover shadow-xl mt-2 border border-border rounded-3xl overflow-hidden">
                            <div className="p-2 border-border border-b">
                                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search state or capital…" className="bg-white dark:bg-black px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-ring w-full text-sm" />
                            </div>

                            <div className="max-h-72 overflow-y-auto">
                                {filteredStates.map((s) => {
                                    const isSelected = state === s.name

                                    return (
                                        <button key={s.name} onClick={() => { setSearchParam("state", s.name); setIsOpen(false); setSearchTerm("") }}
                                            className={`flex w-full flex-col px-4 py-3 text-left transition ${isSelected ? "bg-accent/40" : "hover:bg-accent/20"}`}>
                                            <span className="font-medium text-sm">{s.name}</span>
                                            <span className={`text-xs ${isSelected ? "text-primary" : "text-muted"}`}>
                                                {s.capital}
                                            </span>
                                        </button>
                                    )
                                })}

                                {!filteredStates.length && (
                                    <div className="px-4 py-6 text-muted text-sm text-center">
                                        No results found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={toggleAdvanced} className="mt-2 text-primary text-sm hover:underline cursor-pointer">
                    {advanced ? "Hide advanced filters" : <span><DocumentFilter className="inline mr-1 size-4" />Show advanced filters</span>}
                </button>

                {advanced &&
                    <section className="space-y-4 mt-4">
                        {/* ===== CITY FILTER ===== */}
                        <div className="space-y-1">
                            <label htmlFor="city-filter" className="flex items-center gap-2 font-medium text-xs">
                                <Map className="size-4" />
                                Filter by city
                            </label>
                            <input id="city-filter" value={city ?? ""} onChange={(e) => setSearchParam("city", e.target.value)} placeholder="Enter city"
                                className="bg-linear-to-r from-primary/10 hover:from-primary/20 to-primary/20 hover:to-primary/40 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-ring w-full text-sm transition" />
                        </div>

                        {/* ===== STREET FILTER ===== */}
                        <div className="space-y-1">
                            <label htmlFor="street-filter" className="flex items-center gap-2 font-medium text-xs">
                                <AlignVertically className="size-4" />
                                Filter by street
                            </label>
                            <input id="street-filter" value={street ?? ""} onChange={(e) => setSearchParam("street", e.target.value)} placeholder="Enter street" className="bg-linear-to-r from-primary/10 hover:from-primary/20 to-primary/20 hover:to-primary/40 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-ring w-full text-sm transition" />
                        </div>

                        {/* ===== NAME FILTER ===== */}
                        <div className="space-y-1">
                            <label htmlFor="name-filter" className="flex items-center gap-2 font-medium text-xs">
                                <TagUser className="size-4" />
                                Filter by name
                            </label>
                            <input id="name-filter" value={name ?? ""} onChange={(e) => setSearchParam("name", e.target.value)} placeholder="Enter name" className="bg-linear-to-r from-primary/10 hover:from-primary/20 to-primary/20 hover:to-primary/40 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-ring w-full text-sm transition" />
                        </div>
                    </section>
                }
            </div>
        </Card>
    )
}

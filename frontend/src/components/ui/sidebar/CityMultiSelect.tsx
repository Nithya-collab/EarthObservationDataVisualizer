"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import { useState } from "react";

export function CityMultiSelect({
    onChange,
}: {
    onChange?: (values: string[]) => void;
}) {
    const [selected, setSelected] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Fetch cities (Tamil Nadu example)
    const { data: districts = [] } = useQuery<string[]>({
        queryKey: ["districts"],
        queryFn: async () => {
            const res = await fetch(
                "https://countriesnow.space/api/v0.1/countries/state/cities",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ country: "India", state: "Tamil Nadu" })
                }
            );
            const json = await res.json();
            return json.data || [];
        },
    });

    const toggleSelect = (item: string) => {
        const updated = selected.includes(item)
            ? selected.filter((i) => i !== item)
            : [...selected, item];

        setSelected(updated);
        onChange?.(updated);
    };

    return (
        <div
            className="space-y-2 relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <Command className="border rounded-md">

                {/* Display selected cities */}
                <div
                    className="border-b px-2 py-2 flex flex-wrap gap-2 min-h-[45px]"
                    onClick={() => setIsOpen(!isOpen)}
                >

                    {/* If nothing selected */}
                    {selected.length === 0 && (
                        <span className="text-muted-foreground">Select cities...</span>
                    )}

                    {/* Show only first two selected as badges */}
                    {selected.slice(0, 1).map((item) => (
                        <span
                            key={item}
                            className="flex items-center bg-gray-300 text-black px-1 rounded text-sm"
                        >
                            {item}

                            {/* Cancel (remove) button */}
                            <button
                                type="button"
                                className="font-bold w-[10px]"
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent opening dropdown
                                    toggleSelect(item);  // remove immediately
                                }}
                            >
                                ×
                            </button>
                        </span>
                    ))}

                    {/* If more than 2 selected, show "+X more" */}
                    {selected.length > 1 && (
                        <span className="text-sm text-gray-500">
                            +{selected.length - 1} more…
                        </span>
                    )}
                </div>

                {/* City dropdown */}
                {isOpen && (
                    <CommandList className="max-h-60 overflow-y-auto">
                        <CommandGroup>
                            {districts.map((district) => (
                                <CommandItem
                                    key={district}
                                    value={district}
                                    onSelect={() => toggleSelect(district)}
                                >
                                    <span className="flex justify-between items-center w-full">
                                        {district}
                                        {selected.includes(district) && (
                                            <span className="text-green-500">✔</span>
                                        )}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                )}
            </Command>



        </div>
    );
}







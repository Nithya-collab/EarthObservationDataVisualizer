"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Command,
    CommandInput,
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
                <CommandInput placeholder="Search city or district..." />
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







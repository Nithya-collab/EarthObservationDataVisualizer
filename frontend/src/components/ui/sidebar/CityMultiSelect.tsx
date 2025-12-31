// "use client";

// import { useQuery } from "@tanstack/react-query";
// import {
//     Command,
//     CommandGroup,
//     CommandItem,
//     CommandList
// } from "@/components/ui/command";
// import { useState } from "react";

// export function CityMultiSelect({
//     value = [],
//     onChange,
// }: {
//     value?: string[];
//     onChange?: (values: string[]) => void;
// }) {
//     const [isOpen, setIsOpen] = useState(false);

//     // Fetch cities (Tamil Nadu example)
//     const { data: districts = [] } = useQuery<string[]>({
//         queryKey: ["districts"],
//         queryFn: async () => {
//             const res = await fetch(
//                 "https://countriesnow.space/api/v0.1/countries/state/cities",
//                 {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ country: "India", state: "Tamil Nadu" })
//                 }
//             );
//             const json = await res.json();
//             return json.data || [];
//         },
//     });

//     const toggleSelect = (item: string) => {
//         const updated = value.includes(item)
//             ? value.filter((i) => i !== item)
//             : [...value, item];

//         onChange?.(updated);
//     };

//     return (
//         <div
//             className="space-y-2 relative"
//             onMouseEnter={() => setIsOpen(true)}
//             onMouseLeave={() => setIsOpen(false)}
//         >
//             <Command className="border rounded-md">

//                 {/* Display selected cities */}
//                 <div
//                     className="border-b px-2 py-2 flex flex-wrap gap-2 min-h-[45px]"
//                     onClick={() => setIsOpen(!isOpen)}
//                 >

//                     {/* If nothing value */}
//                     {value.length === 0 && (
//                         <span className="text-muted-foreground">Select cities...</span>
//                     )}

//                     {/* Show only first two value as badges */}
//                     {value.slice(0, 1).map((item) => (
//                         <span
//                             key={item}
//                             className="flex items-center bg-gray-300 text-black px-1 rounded text-sm"
//                         >
//                             {item}

//                             {/* Cancel (remove) button */}
//                             <button
//                                 type="button"
//                                 className="font-bold w-[10px]"
//                                 onClick={(e) => {
//                                     e.stopPropagation(); // prevent opening dropdown
//                                     toggleSelect(item);  // remove immediately
//                                 }}
//                             >
//                                 ×
//                             </button>
//                         </span>
//                     ))}

//                     {/* If more than 2 value, show "+X more" */}
//                     {value.length > 1 && (
//                         <span className="text-sm text-gray-500">
//                             +{value.length - 1} more…
//                         </span>
//                     )}
//                 </div>

//                 {/* City dropdown */}
//                 {isOpen && (
//                     <CommandList className="max-h-60 overflow-y-auto">
//                         <CommandGroup>
//                             {districts.map((district) => (
//                                 <CommandItem
//                                     key={district}
//                                     value={district}
//                                     onSelect={() => toggleSelect(district)}
//                                 >
//                                     <span className="flex justify-between items-center w-full">
//                                         {district}
//                                         {value.includes(district) && (
//                                             <span className="text-green-500">✔</span>
//                                         )}
//                                     </span>
//                                 </CommandItem>
//                             ))}
//                         </CommandGroup>
//                     </CommandList>
//                 )}
//             </Command>



//         </div>
//     );
// }






















"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useState } from "react";

export function CityMultiSelect({
    value = [], // NOW AN ARRAY
    onChange,
}: {
    value?: string[];
    onChange?: (values: string[]) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    // Fetch Indian states (Renamed key for clarity)
    const { data: states = [] } = useQuery<string[]>({
        queryKey: ["india-states"],
        queryFn: async () => {
            const res = await fetch(
                "https://countriesnow.space/api/v0.1/countries/states",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ country: "India" }),
                }
            );

            const json = await res.json();
            return json?.data?.states?.map((s: any) => s.name) ?? [];
        },
    });

    const toggleSelect = (item: string) => {
        const updated = value.includes(item)
            ? value.filter((i) => i !== item)
            : [...value, item];

        onChange?.(updated);
    };

    return (
        <div
            className="space-y-2 relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <Command className="border rounded-md">

                {/* Selected states display area */}
                <div
                    className="border-b px-2 py-2 min-h-[45px] flex flex-wrap gap-2 items-center"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {value.length === 0 && (
                        <span className="text-muted-foreground">Select states...</span>
                    )}

                    {value.slice(0, 1).map((item) => (
                        <span
                            key={item}
                            className="bg-gray-300 text-black px-2 py-0.5 rounded text-sm flex items-center gap-1"
                        >
                            {item}
                            <button
                                type="button"
                                className="font-bold hover:text-red-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSelect(item);
                                }}
                            >
                                ×
                            </button>
                        </span>
                    ))}

                    {value.length > 1 && (
                        <span className="text-xs font-medium text-muted-foreground">
                            +{value.length - 1} more
                        </span>
                    )}
                </div>

                {/* State dropdown */}
                {isOpen && (
                    <CommandList className="max-h-60 overflow-y-auto">
                        <CommandGroup>
                            {states.map((state) => (
                                <CommandItem
                                    key={state}
                                    value={state}
                                    onSelect={() => toggleSelect(state)}
                                >
                                    <span className="flex justify-between w-full">
                                        {state}
                                        {value.includes(state) && (
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


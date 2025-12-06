"use client";

import { useState, useEffect, useMemo } from "react";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Select from "@radix-ui/react-select"
import { VirtualizedYearSelect } from "./custom/virtualized-yearselect";

export default function YearRangeSelect({
  initialStart = 2025,
  initialEnd = 2027,
  onChange,
}: {
  initialStart?: number;
  initialEnd?: number;
  onChange?: (range: [number, number]) => void;
}) {

  const [start, setStart] = useState<number>(initialStart);
  const [end, setEnd] = useState<number>(initialEnd);

  // const YEARS = [2025, 2026, 2027, 2028, 2029, 2030, 2031];
  // Use useMemo to calculate the full list of years only once
  const YEARS = useMemo(() =>
    Array.from({ length: 2252 - 2025 + 1 }, (_, i) => 1900 + i),
    []
  );

  // Filter the years available in the "To" select based on the currently selected "From" year
  const availableEndYears = useMemo(() => {
    return YEARS.filter(year => year >= start);
  }, [start, YEARS]); // Re-calculate only when 'start' changes

  // Handler for the "To" select
  const handleEndChange = (value: string) => {
    setEnd(Number(value));
  };

  // Use useEffect *only* for calling the external onChange handler
  useEffect(() => {
    onChange?.([start, end]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  return (
    <div className="flex items-center space-x-3 mt-5">
      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1 ml-3">From</label>
        <VirtualizedYearSelect
          value={start}
          onChange={(v) => {
            const newStart = Number(v);
            setStart(newStart);
            if (newStart > end) setEnd(newStart);
          }}
          items={YEARS}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1">To</label>
        <Select.Root onValueChange={(v) => handleEndChange(v)} defaultValue={String(end)}>
          <SelectTrigger className="w-26">
            <SelectValue placeholder="End" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto">
            <SelectGroup>
              {/* The 'To' list still needs dynamic filtering based on the 'start' state, 
                  so we map over the filtered list 'availableEndYears' here. */}
              {availableEndYears.map((y) => (
                <SelectItem
                  key={y}
                  value={String(y)}
                >
                  {y}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select.Root>
      </div>
    </div>
  );
}

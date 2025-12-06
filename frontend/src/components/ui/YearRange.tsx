"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

export default function YearRangeSelect({
  initialStart = 2025,
  initialEnd = 2027,
  onChange,
}: {
  initialStart?: number;
  initialEnd?: number;
  onChange?: (range: [number, number]) => void;
}) {

    // The scrollable element for your list
  const parentRef = React.useRef(null)
  
  const [start, setStart] = useState<number>(initialStart);
  const [end, setEnd] = useState<number>(initialEnd);
  
  // const YEARS = [2025, 2026, 2027, 2028, 2029, 2030, 2031];
  // Use useMemo to calculate the full list of years only once
  const YEARS = useMemo(() => 
    Array.from({ length: 2250 - 2025 + 1 }, (_, i) => 1900 + i), 
  []
);

    // **NEW:** Create the array of <SelectItem> components directly in useMemo for the "From" select
  const StartYearItems = useMemo(() => {
    return YEARS.map((y) => (
        <SelectItem key={y} value={String(y)}>
            {y}
        </SelectItem>
    ));
  }, [YEARS]); // Dependency array includes ALL_YEARS which is stable

  // Filter the years available in the "To" select based on the currently selected "From" year
  const availableEndYears = useMemo(() => {
    return YEARS.filter(year => year >= start);
  }, [start, YEARS]); // Re-calculate only when 'start' changes

    // Handler for the "From" select
  const handleStartChange = (value: string) => {
    const newStart = Number(value);
    setStart(newStart);
    // If the new start year is after the current end year, also update the end year
    if (newStart > end) {
      setEnd(newStart);
    }
  };

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
        <Select onValueChange={(v) => handleStartChange(v)} defaultValue={String(start)}>
          <SelectTrigger className="w-26">
            <SelectValue placeholder="Start" />
          </SelectTrigger>
          <SelectContent ref={parentRef} className="max-h-48 overflow-y-auto">
            <SelectGroup>
              {/* Use the pre-calculated array of components here */}
              {StartYearItems.slice(24,47)}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1">To</label>
        <Select onValueChange={(v) => handleEndChange(v)} defaultValue={String(end)}>
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
        </Select>
      </div>
    </div>
  );
}

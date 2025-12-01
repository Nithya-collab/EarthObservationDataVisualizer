"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function YearRangeSelect({
  initialStart = 2025,
  initialEnd = 2027,
  onChange,
}: {
  initialStart?: number;
  initialEnd?: number;
  onChange?: (range: [number, number]) => void;
}) {
//   const YEARS = [2025, 2026, 2027, 2028, 2029, 2030, 2031];
const YEARS = Array.from({ length: 3000 - 2025 + 1 }, (_, i) => 2025 + i);

  const [start, setStart] = useState<number>(initialStart);
  const [end, setEnd] = useState<number>(initialEnd);

  // ensure valid range when user picks values
  useEffect(() => {
    if (start > end) {
      // if start becomes greater than end, push end forward to start
      setEnd(start);
    }
    onChange?.([start, end]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  return (
    <div className="flex items-center space-x-3 mt-5">
      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1 ml-3">From</label>
        <Select onValueChange={(v) => setStart(Number(v))} defaultValue={String(start)}>
          <SelectTrigger className="w-26">
            <SelectValue placeholder="Start" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto">
            <SelectGroup>
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1">To</label>
        <Select onValueChange={(v) => setEnd(Number(v))} defaultValue={String(end)}>
          <SelectTrigger className="w-26">
            <SelectValue placeholder="End" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto">
            <SelectGroup>
              {YEARS.map((y) => (
                <SelectItem
                  key={y}
                  value={String(y)}
                  // optionally disable items that are less than start
                  aria-disabled={y < start}
                  className={y < start ? "opacity-50 pointer-events-none" : ""}
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

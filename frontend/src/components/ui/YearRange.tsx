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
  initialStart = 2023,
  initialEnd = 2025,
  onChange,
}: {
  initialStart?: number;
  initialEnd?: number;
  onChange?: (range: [number, number]) => void;
}) {
  /* Show 2023 to 2030, but only 2023-2025 are selectable */
  const YEARS = Array.from({ length: 2030 - 2023 + 1 }, (_, i) => 2023 + i);

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

  const isYearDisabled = (y: number) => y < 2023 || y > 2025;

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
                <SelectItem
                  key={y}
                  value={String(y)}
                  disabled={isYearDisabled(y)}
                  className={isYearDisabled(y) ? "opacity-50" : ""}
                >
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
                  // Logic: disable if outside 2023-2025 OR if it's smaller than start year
                  disabled={isYearDisabled(y) || y < start}
                  className={(isYearDisabled(y) || y < start) ? "opacity-50" : ""}
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

"use client";

import * as Select from "@radix-ui/react-select";
import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface VirtualizedYearSelectProps {
  items: number[];
  value: number;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  rowHeight?: number;
}

export function VirtualizedYearSelect({
  items,
  value,
  onChange,
  placeholder = "Select",
  height = 250,
  rowHeight = 32,
}: VirtualizedYearSelectProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // When select opens, wait for portal to mount
  useEffect(() => {
    if (open && scrollRef.current) {
      setMounted(true);
    }
  }, [open, scrollRef.current]);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    enabled: mounted,            // <-- only true when portal + scrollRef ready
    overscan: 5,
  });

  return (
    <Select.Root
      value={String(value)}
      onValueChange={onChange}
      onOpenChange={setOpen}
    >
      <Select.Trigger className="border rounded px-3 py-2 w-32 text-left">
        <Select.Value placeholder={placeholder}>
          {value}
        </Select.Value>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          className="bg-white border shadow-md rounded-md z-10"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div
            ref={scrollRef}
            style={{
              height,
              overflowY: "auto",
              position: "relative",
              minWidth: 120,
            }}
          >
            <div
              style={{
                height: virtualizer.getTotalSize(),
                position: "relative",
              }}
            >
              {mounted &&
                virtualizer.getVirtualItems().map((v) => {
                  const item = items[v.index];
                  console.log("Rendering:", item);
                  return (
                    <Select.Item
                      key={item}
                      value={String(item)}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: rowHeight,
                        transform: `translateY(${v.start}px)`,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 10,
                      }}
                      className="hover:bg-accent cursor-pointer"
                    >
                      <Select.ItemText>{item}</Select.ItemText>
                    </Select.Item>
                  );
                })}
            </div>
          </div>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

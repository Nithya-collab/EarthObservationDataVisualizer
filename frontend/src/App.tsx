import { AppSidebar } from "@/components/ui/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Leaflet from "./components/ui/library/Leaflet";
import { ModeToggle } from "./components/ui/mode-toggle";
import { cn } from "./lib/utils";
import BrightnessOpacityControl from "./components/ui/controlles/BrightnessOpacityControl";
import { useState } from "react";

function SidebarInsetContent({
  brightness,
  opacity,
  setBrightness,
  setOpacity,
  districts,
  range,
  category,
}: any) {
  const { open, isMobile } = useSidebar();

  return (
    <SidebarInset>
      {/* HEADER */}
      <header className="absolute top-4 left-12 z-50 flex items-center gap-2 px-4">
        <SidebarTrigger
          className={cn(
            "size-9 bg-orange-200 dark:bg-black",
            isMobile ? "-ml-12" : open ? "ml-32" : "-ml-12"
          )}
        />
        <Separator orientation="vertical" className="h-4" />
      </header>

      {/* MAP + OVERLAYS WRAPPER */}
      <div className="relative flex-1 h-screen">
        {/* MAP */}
        <Leaflet
          brightness={brightness}
          opacity={opacity}
          filters={{
            district: districts.join(","),
            start: range[0],
            end: range[1],
            category: category.join(","),
          }}
        />

        {/* LEGEND */}
        <Legend className="bg-white/60 dark:bg-black/60" />

        {/* BRIGHTNESS + OPACITY */}
        <div className="absolute top-1/2 right-4 z-50 -translate-y-1/2">
          <BrightnessOpacityControl
            brightness={brightness}
            opacity={opacity}
            onBrightnessChange={setBrightness}
            onOpacityChange={setOpacity}
          />
        </div>

        {/* MODE TOGGLE */}
        <ModeToggle className="absolute top-4 right-14 z-50 bg-white/60 dark:bg-black/60" />
      </div>
    </SidebarInset>
  );
}

function Legend({ className }: React.ComponentProps<"div">) {
  return (
    <div
      id="legend"
      className={cn(
        className,
        "absolute bottom-8 right-8 z-50 backdrop-blur-sm shadow-xl px-6 py-6 rounded-lg space-y-4"
      )}
    >
      <h2 className="font-semibold text-lg">Legend</h2>

      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-red-300/40 border border-white/20"></div>
        <span>Low</span>
      </div>

      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-red-500/40 border border-white/20"></div>
        <span>Medium</span>
      </div>

      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-red-700/40 border border-white/20"></div>
        <span>High</span>
      </div>
    </div>
  );
}

export default function Page() {
  const [brightness, setBrightness] = useState(100);
  const [opacity, setOpacity] = useState(100);

  const [districts, setDistricts] = useState<string[]>([]);
  const [range, setRange] = useState<[number, number]>([2025, 2027]);
  const [category, setCategory] = useState<string[]>([]);

  return (
    <SidebarProvider>
      <AppSidebar
        districts={districts}
        setDistricts={setDistricts}
        range={range}
        setRange={setRange}
        category={category}
        setCategory={setCategory}
      />

      <SidebarInsetContent
        brightness={brightness}
        opacity={opacity}
        setBrightness={setBrightness}
        setOpacity={setOpacity}
        districts={districts}
        range={range}
        category={category}
      />
    </SidebarProvider>
  );
}

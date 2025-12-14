import { AppSidebar } from "@/components/ui/sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import Leaflet from "./components/ui/library/Leaflet"
import { ModeToggle } from "./components/ui/mode-toggle"
import { cn } from "./lib/utils"
import BrightnessOpacityControl from "./components/ui/controlles/BrightnessOpacityControl"
import { useState } from "react"

import {Card, CardContent} from "@/components/ui/card"

function SidebarInsetContent({
  brightness,
  opacity,
  setBrightness,
  setOpacity,
  districts,
  range,
  category,
   mouseLatLng,
  setMouseLatLng
}: any) {
  const { open, isMobile } = useSidebar();
 function toDegree(value: number, type: "lat" | "lng") {
  const abs = Math.abs(value).toFixed(4);
  const direction =
    type === "lat"
      ? value >= 0 ? "N" : "S"
      : value >= 0 ? "E" : "W";

  return `${abs}° ${direction}`;
}

  return (
    <SidebarInset>
      <header className="flex absolute top-4 left-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className={cn("size-9 bg-orange-200 dark:bg-black z-10",
          isMobile ? "-ml-12" : open ? "ml-32" : "-ml-12"
        )} />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
      </header>
<Card
  className="
    absolute
    top-4
    left-1/2
    -translate-x-1/2
    z-30
    w-[300px]
    bg-card/80
    backdrop-blur-sm
    text-card-foreground
    shadow-xl
  "
>

  <CardContent className="flex justify-center gap-4">
    <p>
  lat: {mouseLatLng ? toDegree(mouseLatLng.lat, "lat") : "--"}
</p>
<p>
  lng: {mouseLatLng ? toDegree(mouseLatLng.lng, "lng") : "--"}
</p>

  </CardContent>
</Card>

      <div className="flex">
        <Leaflet
          brightness={brightness}
          opacity={opacity}
          filters={{
            district: districts.join(","),
            start: range[0],
            end: range[1],
            category: category.join(",")
          }}
          onMouseMove={setMouseLatLng}
        />
        {/* <Map /> */}
        <Legend className="bg-white/45 dark:bg-black/45!" />
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <BrightnessOpacityControl
            brightness={brightness}
            opacity={opacity}
            onBrightnessChange={setBrightness}
            onOpacityChange={setOpacity}
          />
        </div>

        {/* <ModeToggle className="bg-white/45 dark:bg-black/45! z-2 absolute bottom-5 right-2"></ModeToggle> */}
        <div className="relative">
          <ModeToggle className="mr-20 bg-white/45 dark:bg-black/45 !z-20 absolute top-2 right-2" />
        </div>

      </div>
    </SidebarInset>
  )

}

function Legend({ className }: React.ComponentProps<"div">) {
  return (
    <div>
      {/* LEGEND */}
      <div id="legend" className={cn(className, "backdrop-blur-xs absolute bottom-8 right-8 shadow-xl px-6 py-6 rounded-lg space-y-4")}>
        <h2 className="font-semibold text-lg mb-2">Legend</h2>

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
    </div>
  )
}

export default function Page() {
  const [brightness, setBrightness] = useState(100);
  const [opacity, setOpacity] = useState(100);

  const [districts, setDistricts] = useState<string[]>([]);
  const [range, setRange] = useState<[number, number]>([2025, 2027]);
  const [category, setCategory] = useState<string[]>([]);

  const [mouseLatLng, setMouseLatLng] = useState<{ lat: number; lng: number } | null>(null);

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
         mouseLatLng={mouseLatLng}          
        setMouseLatLng={setMouseLatLng}
      />
    </SidebarProvider>


  )
}

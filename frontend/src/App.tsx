// import { AppSidebar } from "@/components/ui/sidebar/app-sidebar"
// import { Separator } from "@/components/ui/separator"
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
//   useSidebar,
// } from "@/components/ui/sidebar"
// import Leaflet from "./components/ui/library/Leaflet"
// import { ModeToggle } from "./components/ui/mode-toggle"
// import { cn } from "./lib/utils"
// import BrightnessOpacityControl from "./components/ui/controlles/BrightnessOpacityControl"
// import { useState } from "react"

// import {Card, CardContent} from "@/components/ui/card"

// function SidebarInsetContent({
//   brightness,
//   opacity,
//   setBrightness,
//   setOpacity,
//   districts,
//   range,
//   category,
//    mouseLatLng,
//   setMouseLatLng
// }: any) {
//   const { open, isMobile } = useSidebar();
//  function toDegree(value: number, type: "lat" | "lng") {
//   const abs = Math.abs(value).toFixed(4);
//   const direction =
//     type === "lat"
//       ? value >= 0 ? "N" : "S"
//       : value >= 0 ? "E" : "W";

//   return `${abs}° ${direction}`;
// }

//   return (
//     <SidebarInset>
//       <header className="flex absolute top-4 left-12 shrink-0 items-center gap-2 border-b px-4">
//         <SidebarTrigger className={cn("size-9 bg-orange-200 dark:bg-black z-10",
//           isMobile ? "-ml-12" : open ? "ml-32" : "-ml-12"
//         )} />
//         <Separator
//           orientation="vertical"
//           className="mr-2 data-[orientation=vertical]:h-4"
//         />
//       </header>
// <Card
//   className="
//     absolute
//     top-4
//     left-1/2
//     -translate-x-1/2
//     z-30
//     w-[300px]
//     bg-card/80
//     backdrop-blur-sm
//     text-card-foreground
//     shadow-xl
//   "
// >

//   <CardContent className="flex justify-center gap-4">
//     <p>
//   lat: {mouseLatLng ? toDegree(mouseLatLng.lat, "lat") : "--"}
// </p>
// <p>
//   lng: {mouseLatLng ? toDegree(mouseLatLng.lng, "lng") : "--"}
// </p>

//   </CardContent>
// </Card>

//       <div className="flex">
//         <Leaflet
//           brightness={brightness}
//           opacity={opacity}
//           filters={{
//             district: districts.join(","),
//             start: range[0],
//             end: range[1],
//             category: category.join(",")
//           }}
//           // onMouseMove={setMouseLatLng}
//         />
//         {/* <Map /> */}
//         <Legend className="bg-white/45 dark:bg-black/45!" />
//         <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
//           <BrightnessOpacityControl
//             brightness={brightness}
//             opacity={opacity}
//             onBrightnessChange={setBrightness}
//             onOpacityChange={setOpacity}
//           />
//         </div>

//         {/* <ModeToggle className="bg-white/45 dark:bg-black/45! z-2 absolute bottom-5 right-2"></ModeToggle> */}
//         <div className="relative">
//           <ModeToggle className="mr-20 bg-white/45 dark:bg-black/45 !z-20 absolute top-2 right-2" />
//         </div>

//       </div>
//     </SidebarInset>
//   )

// }

// function Legend({ className }: React.ComponentProps<"div">) {
//   return (
//     <div>
//       {/* LEGEND */}
//       <div id="legend" className={cn(className, "backdrop-blur-xs absolute bottom-8 right-8 shadow-xl px-6 py-6 rounded-lg space-y-4")}>
//         <h2 className="font-semibold text-lg mb-2">Legend</h2>

//         <div className="flex items-center space-x-3">
//           <div className="w-6 h-6 bg-red-300/40 border border-white/20"></div>
//           <span>Low</span>
//         </div>

//         <div className="flex items-center space-x-3">
//           <div className="w-6 h-6 bg-red-500/40 border border-white/20"></div>
//           <span>Medium</span>
//         </div>

//         <div className="flex items-center space-x-3">
//           <div className="w-6 h-6 bg-red-700/40 border border-white/20"></div>
//           <span>High</span>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function Page() {
//   const [brightness, setBrightness] = useState(100);
//   const [opacity, setOpacity] = useState(100);

//   const [districts, setDistricts] = useState<string[]>([]);
//   const [range, setRange] = useState<[number, number]>([2025, 2027]);
//   const [category, setCategory] = useState<string[]>([]);

//   const [mouseLatLng, setMouseLatLng] = useState<{ lat: number; lng: number } | null>(null);

//   return (
//     <SidebarProvider>
//       <AppSidebar
//         districts={districts}
//         setDistricts={setDistricts}
//         range={range}
//         setRange={setRange}
//         category={category}
//         setCategory={setCategory}
//       />
//       <SidebarInsetContent
//         brightness={brightness}
//         opacity={opacity}
//         setBrightness={setBrightness}
//         setOpacity={setOpacity}
//         districts={districts}
//         range={range}
//         category={category}
//          mouseLatLng={mouseLatLng}          
//         setMouseLatLng={setMouseLatLng}
//       />
//     </SidebarProvider>


//   )
// }






















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
import { Card, CardContent } from "@/components/ui/card";

import { DetailsCard } from "@/components/ui/DetailsCard";

function SidebarInsetContent({
  brightness,
  opacity,
  setBrightness,
  setOpacity,
  districts,
  range,
  category,
  hospitalSearch,
  mouseLatLng,
  setMouseLatLng,
}: any) {
  const { open, isMobile } = useSidebar();
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  function toDegree(value: number, type: "lat" | "lng") {
    const abs = Math.abs(value).toFixed(4);
    const direction =
      type === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";
    return `${abs}° ${direction}`;
  }

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
            hospital: hospitalSearch // Pass the search term
          }}
          onMouseMove={setMouseLatLng}
          onFeatureClick={(feature, latlng) => {
            console.log("Selected (Click):", feature);

            const baseDetails = {
              "Category": category.join(","),
              State: feature.properties.state || feature.properties.State,
              Pincode: feature.properties.pincode || feature.properties.Pincode,
              Village: feature.properties.village,
              City: feature.properties.city || feature.properties.City,
              District: feature.properties.district || feature.properties.District,
              Latitude: latlng?.lat.toFixed(4),
              Longitude: latlng?.lng.toFixed(4)
            };

            const hospitalDetails = feature.properties.Hospital_Name ? {
              "Hospital Name": feature.properties.Hospital_Name,
              "Hospital Category": feature.properties.Hospital_Category,
              "Care Type": feature.properties.Hospital_Care_Type,
            } : {};

            const riverDetails = feature.properties.River_Name ? {
              "River Name": feature.properties.River_Name,
              "Origin": feature.properties.Origin,
            } : {};

            const tempDetails = feature.properties.Temperature ? {
              "City": feature.properties.City,
              "Temperature": feature.properties.Temperature + "°C",
              "Avg Rainfall": (feature.properties.Rainfall || 0) + "mm",
              "Dry Days": feature.properties.Dryness || 0,
              "Flood Risk": feature.properties.Flood || "Unknown",
              "Condition": feature.properties.Description
            } : {};

            setSelectedFeature({ ...baseDetails, ...hospitalDetails, ...riverDetails, ...tempDetails });
          }}
          onFeatureHover={(feature, latlng) => {
            console.log("Selected (Hover):", feature);

            const baseDetails = {
              "Category": category.join(","),
              State: feature.properties.state || feature.properties.State,
              Pincode: feature.properties.pincode || feature.properties.Pincode,
              Village: feature.properties.village,
              District: feature.properties.district || feature.properties.District,
              City: feature.properties.city || feature.properties.City,
              Latitude: latlng?.lat.toFixed(4),
              Longitude: latlng?.lng.toFixed(4)
            };

            const hospitalDetails = feature.properties.Hospital_Name ? {
              "Hospital Name": feature.properties.Hospital_Name,
              "Hospital Category": feature.properties.Hospital_Category,
            } : {};

            const riverDetails = feature.properties.River_Name ? {
              "River Name": feature.properties.River_Name,
            } : {};

            const tempDetails = feature.properties.Temperature ? {
              "Temperature": feature.properties.Temperature + "°C",
              "Rainfall": (feature.properties.Rainfall || 0) + "mm",
              "Dryness": feature.properties.Dryness || 0,
              "Flood Risk": feature.properties.Flood || "Unknown"
            } : {};

            setSelectedFeature({ ...baseDetails, ...hospitalDetails, ...riverDetails, ...tempDetails });
          }}
        />

        {selectedFeature && (
          <DetailsCard
            title="Geographical Details"
            data={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}

        {/* LAT / LNG CARD */}
        <Card
          className="
            absolute
            top-4
            left-1/2
            -translate-x-1/2
            z-50
            w-[300px]
            bg-card/80
            backdrop-blur-sm
            shadow-xl
          "
        >
          <CardContent className="flex justify-center gap-4 text-sm">
            <p>
              lat:{" "}
              {mouseLatLng ? toDegree(mouseLatLng.lat, "lat") : "--"}
            </p>
            <p>
              lng:{" "}
              {mouseLatLng ? toDegree(mouseLatLng.lng, "lng") : "--"}
            </p>
          </CardContent>
        </Card>

        {/* LEGEND */}
        <Legend className="bg-white/60 dark:bg-black/60" activeCategories={category} />

        {/* BRIGHTNESS + OPACITY */}
        {/* <div className="absolute top-1/2 right-4 z-50 -translate-y-1/2">
          <BrightnessOpacityControl
            brightness={brightness}
            opacity={opacity}
            onBrightnessChange={setBrightness}
            onOpacityChange={setOpacity}
          />
        </div> */}

        {/* MODE TOGGLE */}
        <ModeToggle className="absolute top-4 right-14 z-50 bg-white/60 dark:bg-black/60" />
      </div>
    </SidebarInset>
  );
}

function Legend({ className, activeCategories = [] }: { className?: string, activeCategories?: string[] }) {
  if (!activeCategories.length) return null;

  return (
    <div
      id="legend"
      className={cn(
        className,
        "absolute bottom-8 right-8 z-50 backdrop-blur-sm shadow-xl px-4 py-4 rounded-lg space-y-4 text-xs max-h-[60vh] overflow-y-auto"
      )}
    >
      {activeCategories.includes("Population") && (
        <div className="space-y-2">
          <h2 className="font-semibold text-sm mb-2">Population Density (per km²)</h2>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#800026]"></div><span>&gt; 1000</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#BD0026]"></div><span>500 - 1000</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#E31A1C]"></div><span>200 - 500</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#FC4E2A]"></div><span>100 - 200</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#FD8D3C]"></div><span>50 - 100</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#FEB24C]"></div><span>20 - 50</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#FED976]"></div><span>10 - 20</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#FFEDA0]"></div><span>&lt; 10</span></div>
        </div>
      )}

      {activeCategories.includes("Temperature") && (
        <div className="space-y-2">
          <h2 className="font-semibold text-sm mb-2">Temperature (°C)</h2>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#ff5722]"></div><span>&gt; 30°C (Hot)</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#ff9800]"></div><span>20°C - 30°C (Warm)</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#4caf50]"></div><span>&lt; 20°C (Mild)</span></div>
        </div>
      )}

      {activeCategories.includes("Flood") && (
        <div className="space-y-2">
          <h2 className="font-semibold text-sm mb-2">Flood Risk</h2>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#b71c1c]"></div><span>High Risk (&gt;250mm)</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#f57f17]"></div><span>Moderate Risk</span></div>
          <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-[#8bc34a]"></div><span>Low/Safe</span></div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const [brightness, setBrightness] = useState(100);
  const [opacity, setOpacity] = useState(100);

  const [districts, setDistricts] = useState<string[]>([]);
  const [range, setRange] = useState<[number, number]>([2023, 2025]);
  const [category, setCategory] = useState<string[]>([]);
  const [hospitalSearch, setHospitalSearch] = useState<string>("");

  const [mouseLatLng, setMouseLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  return (
    <SidebarProvider>
      <AppSidebar
        districts={districts}
        setDistricts={setDistricts}
        range={range}
        setRange={setRange}
        category={category}
        setCategory={setCategory}

        //  new Ui change 

        brightness={brightness}
        opacity={opacity}
        setBrightness={setBrightness}
        setOpacity={setOpacity}
        hospitalSearch={hospitalSearch}
        setHospitalSearch={setHospitalSearch}

      />

      <SidebarInsetContent
        brightness={brightness}
        opacity={opacity}
        setBrightness={setBrightness}
        setOpacity={setOpacity}
        districts={districts}
        range={range}
        category={category}
        hospitalSearch={hospitalSearch}
        mouseLatLng={mouseLatLng}
        setMouseLatLng={setMouseLatLng}
      />
    </SidebarProvider>
  );
}

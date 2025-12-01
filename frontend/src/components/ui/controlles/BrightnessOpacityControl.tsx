"use client";

import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export default function BrightnessOpacityControl({ className }: React.ComponentProps<"div">) {
  const [brightness, setBrightness] = useState(50);
  const [opacity, setOpacity] = useState(100);

  return (
    <div className={`flex flex-row items-center space-x-6 ${className}`}>
      {/* Brightness Slider */}
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium">Brightness</span>
        <Slider
          value={[brightness]}
          onValueChange={(val) => setBrightness(val[0])}
          max={100}
          step={1}
          orientation="vertical"
          className="h-32 w-5 mt-2"
        />
        <span className="text-xs mt-1">{brightness}%</span>
      </div>

      {/* Opacity Slider */}
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium">Opacity</span>
        <Slider
          value={[opacity]}
          onValueChange={(val) => setOpacity(val[0])}
          max={100}
          step={1}
          orientation="vertical"
          className="h-32 w-5 mt-2"
        />
        <span className="text-xs mt-1">{opacity}%</span>
      </div>
    </div>
  );
}

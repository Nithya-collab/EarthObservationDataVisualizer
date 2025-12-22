"use client";

import { Slider } from "@/components/ui/slider";
import { Eye } from "lucide-react";
import { Sun } from "lucide-react";

type Props = {
  className?: string;
  brightness: number;
  opacity: number;
  onBrightnessChange: (value: number) => void;
  onOpacityChange: (value: number) => void;
};

export default function BrightnessOpacityControl({ 
    className,
    brightness,
    opacity,
    onBrightnessChange,
    onOpacityChange
}:Props) {
  

  return (
    
  <div className={`flex flex-col items-center space-x-6${className}`}>
      {/* Brightness */}
      <div className="flex flex-col items-center">
        {/* <span className="text-sm font-medium -mb-15">Brightness</span> */}
        <span className="text-sm font-medium -mb-21 -ml-50"><Sun/></span>
        <Slider
          value={[brightness]}
          onValueChange={(val) => onBrightnessChange(val[0])}
          max={100}
          step={1}
          orientation="horizontal"
          className="h-32 w-40 mt-2"
        />
        <span className="absolute text-xs mt-5">{brightness}%</span>
      </div>

      {/* Opacity */}
      <div className="flex flex-col items-center">
        {/* <span className="text-sm font-medium -mb-15">Opacity</span> */}
        <span className="text-sm font-medium -mb-21 -ml-50"><Eye/></span>

        <Slider
          value={[opacity]}
          onValueChange={(val) => onOpacityChange(val[0])}
          max={100}
          step={1}
          orientation="horizontal"
          className="h-32 w-40 mt-2"
        />
        <span className="absolute text-xs mt-5">{opacity}%</span>
      </div>
    </div>
  );
}

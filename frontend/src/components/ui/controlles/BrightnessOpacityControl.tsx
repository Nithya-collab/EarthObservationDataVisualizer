"use client";

import { Slider } from "@/components/ui/slider";
import { useState } from "react";

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
     <div className={`flex flex-row items-center space-x-6 ${className}`}>
      {/* Brightness */}
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium">Brightness</span>
        <Slider
          value={[brightness]}
          onValueChange={(val) => onBrightnessChange(val[0])}
          max={100}
          step={1}
          orientation="vertical"
          className="h-32 w-5 mt-2"
        />
        <span className="text-xs mt-1">{brightness}%</span>
      </div>

      {/* Opacity */}
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium">Opacity</span>
        <Slider
          value={[opacity]}
          onValueChange={(val) => onOpacityChange(val[0])}
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

/**
 * Map Symbology Legend Component
 * Floating / popover legend describing vector and raster visual layers.
 */

import React, { useState } from "react";
import { Info, X, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export const MapLegend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-secondary/90 border border-border-subtle",
          "text-2xs font-mono text-content-secondary hover:text-content-primary hover:bg-surface-elevated transition-colors",
          isOpen && "border-accent-primary text-accent-primary"
        )}
        title="Toggle Symbology Legend"
      >
        <Layers className="w-3 h-3 text-accent-primary" />
        <span>LEGEND</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-64 rounded-lg bg-surface-elevated/95 border border-border-subtle shadow-2xl p-3 z-50 space-y-2.5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-1.5 border-b border-border-subtle">
            <span className="text-2xs font-mono uppercase tracking-wider text-content-primary font-semibold flex items-center gap-1.5">
              <Info className="w-3 h-3 text-accent-primary" />
              Symbology Key
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-content-muted hover:text-content-primary"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2 text-2xs">
            {/* AOI Layer */}
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-4 rounded border-2 border-amber-500 bg-amber-500/20 shrink-0" />
              <div>
                <div className="font-medium text-content-primary">Area of Interest (AOI)</div>
                <div className="text-content-muted text-[10px]">User-defined target perimeter</div>
              </div>
            </div>

            {/* Scene Footprint */}
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-4 rounded border-2 border-sky-400 bg-sky-400/20 shrink-0" />
              <div>
                <div className="font-medium text-content-primary">Scene Footprint</div>
                <div className="text-content-muted text-[10px]">Hyperspectral sensor spatial coverage</div>
              </div>
            </div>

            {/* Selected Feature */}
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-4 rounded border-2 border-dashed border-white bg-white/10 shrink-0" />
              <div>
                <div className="font-medium text-content-primary">Active Selection</div>
                <div className="text-content-muted text-[10px]">Focused feature highlight</div>
              </div>
            </div>

            {/* Detections Overlay */}
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-4 rounded border border-emerald-400 bg-emerald-500/40 shrink-0" />
              <div>
                <div className="font-medium text-content-primary">Detection Mask (Demo)</div>
                <div className="text-content-muted text-[10px]">CEM / MF anomaly heat signature</div>
              </div>
            </div>
          </div>

          <div className="pt-1.5 border-t border-border-subtle text-[10px] text-content-muted leading-tight font-mono">
            WGS84 Coordinate Reference System (EPSG:4326)
          </div>
        </div>
      )}
    </div>
  );
};


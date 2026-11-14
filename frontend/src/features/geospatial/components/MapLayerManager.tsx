/**
 * Map Layer Manager Component
 * Enables fine-grained visibility toggle and opacity control for
 * AOI vector boundaries, Scene footprints, and detection masks.
 */

import React from "react";
import { useGeospatialStore } from "../store/geospatialStore";
import { Eye, EyeOff, Layers, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

export const MapLayerManager: React.FC = () => {
  const { layers, setLayerVisibility, setLayerOpacity } = useGeospatialStore();

  return (
    <div className="space-y-4 p-3">
      <div className="flex items-center justify-between">
        <div className="text-2xs font-mono uppercase tracking-wider text-content-muted flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-accent-primary" />
          Layer Stack &amp; Opacity
        </div>
      </div>

      <div className="space-y-3">
        {Object.values(layers).map((layer) => {
          return (
            <div
              key={layer.id}
              className={cn(
                "p-3 rounded-lg border transition-all space-y-2.5",
                layer.visible
                  ? "bg-surface-secondary/60 border-border-subtle"
                  : "bg-surface-secondary/20 border-border-subtle/50 opacity-60"
              )}
            >
              {/* Header: Color pill, Name, and Visibility Eye Toggle */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-sm border shrink-0"
                    style={{ backgroundColor: layer.color, borderColor: layer.color }}
                  />
                  <span className="text-xs font-semibold text-content-primary truncate">
                    {layer.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setLayerVisibility(layer.id, !layer.visible)}
                  className={cn(
                    "p-1 rounded text-content-muted hover:text-content-primary transition-colors",
                    layer.visible && "text-accent-primary"
                  )}
                  title={layer.visible ? "Hide Layer" : "Show Layer"}
                >
                  {layer.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Description */}
              <p className="text-[11px] text-content-muted leading-relaxed">
                {layer.description}
              </p>

              {/* Opacity Slider */}
              {layer.visible && (
                <div className="pt-1.5 border-t border-border-subtle/60 flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-content-muted w-14">
                    <Sliders className="w-2.5 h-2.5" />
                    <span>{Math.round(layer.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={layer.opacity}
                    onChange={(e) =>
                      setLayerOpacity(layer.id, parseFloat(e.target.value))
                    }
                    className="w-full h-1 bg-surface-panel rounded-lg appearance-none cursor-pointer accent-accent-primary"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-2.5 rounded-md bg-surface-panel border border-border-subtle text-[11px] text-content-muted leading-tight">
        <span className="text-accent-primary font-medium">Render Order:</span> Raster Basemap &rarr; Scene Footprints &rarr; AOI Vector Polygons &rarr; Dynamic Selection Overlay.
      </div>
    </div>
  );
};


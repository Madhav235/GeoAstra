/**
 * Map Status Bar Component
 * Persistent bottom bar displaying dynamic cursor coordinates, zoom factor,
 * projection datum, OpenFreeMap provider badge, drawing status, and symbology legend.
 */

import React from "react";
import { useGeospatialStore } from "../store/geospatialStore";
import { MapLegend } from "./MapLegend";
import { Crosshair, Compass, PenTool, Globe } from "lucide-react";

export const MapStatusBar: React.FC = () => {
  const { cursorCoords, currentZoom, drawingMode, activeBasemap } = useGeospatialStore();

  const formatCoord = (val: number, isLat: boolean) => {
    const dir = isLat ? (val >= 0 ? "N" : "S") : val >= 0 ? "E" : "W";
    return `${Math.abs(val).toFixed(5)}° ${dir}`;
  };

  return (
    <div className="h-8 px-4 bg-surface-secondary/90 border-t border-border-subtle flex items-center justify-between gap-4 text-2xs font-mono text-content-secondary z-20 select-none backdrop-blur-sm">
      {/* Left: Cursor coordinates and drawing status */}
      <div className="flex items-center gap-4 min-w-0">
        {cursorCoords ? (
          <div className="flex items-center gap-1.5 text-accent-primary font-medium truncate">
            <Crosshair className="w-3.5 h-3.5 shrink-0" />
            <span className="text-content-muted">CURSOR:</span>
            <span className="text-content-primary">
              {formatCoord(cursorCoords.lat, true)}, {formatCoord(cursorCoords.lng, false)}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-content-muted truncate">
            <Crosshair className="w-3.5 h-3.5 shrink-0" />
            <span>Hover map for coordinates</span>
          </div>
        )}

        {drawingMode !== "idle" && (
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold animate-pulse">
            <PenTool className="w-3 h-3" />
            <span>
              {drawingMode === "drawing"
                ? "DRAWING: Click vertices to draw polygon; double-click to close"
                : "EDITING: Drag vertices to adjust boundary"}
            </span>
          </div>
        )}
      </div>

      {/* Right: Zoom level, Provider, CRS, and Legend */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-1">
          <span className="text-content-muted">ZOOM:</span>
          <span className="text-content-primary font-semibold">{currentZoom.toFixed(1)}x</span>
        </div>

        <span className="hidden md:inline text-border-subtle">|</span>

        <div className="hidden sm:flex items-center gap-1.5 text-content-secondary">
          <Globe className="w-3 h-3 text-accent-primary" />
          <span className="text-accent-primary font-semibold">OPENFREEMAP</span>
          <span className="text-content-muted uppercase">({activeBasemap})</span>
        </div>

        <span className="hidden sm:inline text-border-subtle">|</span>

        <div className="hidden lg:flex items-center gap-1 text-content-secondary">
          <Compass className="w-3 h-3 text-content-muted" />
          <span>EPSG:4326</span>
        </div>

        <span className="hidden lg:inline text-border-subtle">|</span>

        <MapLegend />
      </div>
    </div>
  );
};

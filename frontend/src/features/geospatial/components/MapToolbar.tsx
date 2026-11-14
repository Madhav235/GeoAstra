/**
 * Geospatial Studio Top Map Toolbar
 * Integrates search, basemap selector, drawing controls, view presets,
 * and panel toggle buttons.
 */

import React from "react";
import { useGeospatialStore } from "../store/geospatialStore";
import { useMapInstance } from "../hooks/useMapInstance";
import { MapSearch } from "./MapSearch";
import { BasemapSelector } from "./BasemapSelector";
import {
  PenTool,
  X,
  RotateCcw,
  PanelLeft,
  PanelRight,
  Compass,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const MapToolbar: React.FC = () => {
  const {
    drawingMode,
    setDrawingMode,
    isLeftSidebarOpen,
    toggleLeftSidebar,
    isRightPanelOpen,
    toggleRightPanel,
    selectedAoiId,
    aois,
    scenes,
  } = useGeospatialStore();

  const { fitBounds, resetView } = useMapInstance();

  const selectedAOI = aois.find((a) => a.properties.id === selectedAoiId);

  // Compute bounding box covering all scenes
  const handleFitAllScenes = () => {
    if (scenes.length === 0) return;
    let minLng = Infinity,
      minLat = Infinity,
      maxLng = -Infinity,
      maxLat = -Infinity;

    scenes.forEach((s) => {
      const [b0, b1, b2, b3] = s.properties.bbox;
      if (b0 < minLng) minLng = b0;
      if (b1 < minLat) minLat = b1;
      if (b2 > maxLng) maxLng = b2;
      if (b3 > maxLat) maxLat = b3;
    });

    fitBounds([minLng, minLat, maxLng, maxLat], 50);
  };

  const handleFitSelected = () => {
    if (selectedAOI) {
      fitBounds(selectedAOI.properties.bbox, 60);
    }
  };

  return (
    <div className="h-12 px-3 bg-surface-secondary/90 border-b border-border-subtle flex items-center justify-between gap-3 z-30 select-none backdrop-blur-md">
      {/* Left Section: Panel toggle, Search, Basemap */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={toggleLeftSidebar}
          className={cn(
            "p-1.5 rounded-md text-content-secondary hover:text-content-primary hover:bg-surface-elevated transition-colors border border-border-subtle shrink-0",
            isLeftSidebarOpen && "bg-surface-elevated text-accent-primary border-accent-primary/40"
          )}
          title={isLeftSidebarOpen ? "Hide Workspace Panel" : "Show Workspace Panel"}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <MapSearch />

        <div className="hidden sm:block">
          <BasemapSelector />
        </div>
      </div>

      {/* Middle Section: Drawing Controls */}
      <div className="flex items-center gap-1.5 bg-surface-panel/80 p-1 rounded-lg border border-border-subtle">
        {drawingMode === "idle" ? (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs px-2.5 font-medium border-border-subtle hover:border-accent-primary"
            leftIcon={<PenTool className="w-3.5 h-3.5 text-accent-primary" />}
            onClick={() => setDrawingMode("drawing")}
            title="Click map to place polygon vertices"
          >
            <span className="hidden md:inline">Draw</span> Polygon
          </Button>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-2xs font-mono px-2 py-1 rounded bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/40 animate-pulse">
              {drawingMode === "drawing" ? "Drawing Polygon" : "Editing Vertices"}
            </span>
            <Button
              variant="destructive"
              size="sm"
              className="h-7 text-2xs px-2"
              leftIcon={<X className="w-3 h-3" />}
              onClick={() => setDrawingMode("idle")}
              title="Cancel drawing mode"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Right Section: Viewport navigation and panel toggle */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleFitAllScenes}
          className="px-2.5 py-1.5 rounded-md text-2xs font-mono text-content-secondary hover:text-content-primary hover:bg-surface-elevated border border-border-subtle transition-colors hidden lg:flex items-center gap-1.5"
          title="Fit viewport to all 6 benchmark scene footprints"
        >
          <Compass className="w-3 h-3 text-sky-400" />
          <span>Fit Scenes</span>
        </button>

        {selectedAOI && (
          <button
            type="button"
            onClick={handleFitSelected}
            className="px-2.5 py-1.5 rounded-md text-2xs font-mono text-content-secondary hover:text-content-primary hover:bg-surface-elevated border border-border-subtle transition-colors hidden sm:flex items-center gap-1.5"
            title="Fit viewport to selected AOI"
          >
            <MapPin className="w-3 h-3 text-accent-primary" />
            <span>Fit AOI</span>
          </button>
        )}

        <button
          type="button"
          onClick={resetView}
          className="p-1.5 rounded-md text-content-secondary hover:text-content-primary hover:bg-surface-elevated border border-border-subtle transition-colors"
          title="Reset View to Global Extent"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={toggleRightPanel}
          className={cn(
            "p-1.5 rounded-md text-content-secondary hover:text-content-primary hover:bg-surface-elevated transition-colors border border-border-subtle shrink-0",
            isRightPanelOpen && "bg-surface-elevated text-accent-primary border-accent-primary/40"
          )}
          title={isRightPanelOpen ? "Hide Inspector Panel" : "Show Inspector Panel"}
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

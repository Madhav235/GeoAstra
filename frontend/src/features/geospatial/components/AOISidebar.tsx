/**
 * Left Geospatial Studio Sidebar
 * Manages tabs for Saved AOIs, Satellite Benchmark Scenes, and Layer Settings.
 */

import React, { useState } from "react";
import { useGeospatialStore } from "../store/geospatialStore";
import { MapLayerManager } from "./MapLayerManager";
import { ConfirmDialog } from "./ConfirmDialog";
import { useMapInstance } from "../hooks/useMapInstance";
import {
  MapPin,
  Compass,
  Layers,
  Plus,
  Trash2,
  Edit2,
  Navigation,
  Search,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const AOISidebar: React.FC = () => {
  const {
    aois,
    scenes,
    selectedAoiId,
    selectedSceneId,
    selectAOI,
    selectScene,
    deleteAOI,
    setEditingAoiId,
    setDrawingMode,
    activeLeftTab,
    setActiveLeftTab,
    resetAOIsToDefault,
  } = useGeospatialStore();

  const { fitBounds } = useMapInstance();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "area">("recent");
  const [aoiToDelete, setAoiToDelete] = useState<string | null>(null);

  // Filter & Sort AOIs
  const filteredAOIs = aois
    .filter(
      (aoi) =>
        aoi.properties.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (aoi.properties.location &&
          aoi.properties.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.properties.name.localeCompare(b.properties.name);
      if (sortBy === "area") return b.properties.areaKm2 - a.properties.areaKm2;
      return new Date(b.properties.updatedAt).getTime() - new Date(a.properties.updatedAt).getTime();
    });

  const handleZoomToAOI = (e: React.MouseEvent, bbox: [number, number, number, number], id: string) => {
    e.stopPropagation();
    selectAOI(id);
    fitBounds(bbox, 70);
  };

  const handleZoomToScene = (e: React.MouseEvent, bbox: [number, number, number, number], id: string) => {
    e.stopPropagation();
    selectScene(id);
    fitBounds(bbox, 70);
  };

  return (
    <div className="w-80 h-full flex flex-col bg-surface-main/95 border-r border-border-subtle z-20 backdrop-blur-md">
      {/* Sidebar Tab Header */}
      <div className="flex items-center border-b border-border-subtle bg-surface-secondary/50">
        <button
          type="button"
          onClick={() => setActiveLeftTab("aois")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium border-b-2 transition-colors",
            activeLeftTab === "aois"
              ? "border-accent-primary text-accent-primary bg-surface-panel/40"
              : "border-transparent text-content-secondary hover:text-content-primary"
          )}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>AOIs</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-surface-elevated border border-border-subtle">
            {aois.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLeftTab("scenes")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium border-b-2 transition-colors",
            activeLeftTab === "scenes"
              ? "border-accent-primary text-accent-primary bg-surface-panel/40"
              : "border-transparent text-content-secondary hover:text-content-primary"
          )}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Scenes</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-surface-elevated border border-border-subtle">
            {scenes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLeftTab("layers")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium border-b-2 transition-colors",
            activeLeftTab === "layers"
              ? "border-accent-primary text-accent-primary bg-surface-panel/40"
              : "border-transparent text-content-secondary hover:text-content-primary"
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Layers</span>
        </button>
      </div>

      {/* Tab 1: Areas of Interest */}
      {activeLeftTab === "aois" && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Controls: Search, Sort, New AOI button */}
          <div className="p-3 border-b border-border-subtle space-y-2 bg-surface-secondary/20">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3 h-3 text-content-muted absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter AOIs..."
                  className="w-full h-7 pl-7 pr-2 bg-surface-elevated border border-border-subtle rounded text-xs text-content-primary placeholder:text-content-muted focus:outline-none focus:border-accent-primary"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-7 px-2 bg-surface-elevated border border-border-subtle rounded text-2xs text-content-secondary focus:outline-none"
              >
                <option value="recent">Recent</option>
                <option value="name">Name</option>
                <option value="area">Area</option>
              </select>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1 h-7 text-xs"
                leftIcon={<Plus className="w-3 h-3" />}
                onClick={() => setDrawingMode("drawing")}
              >
                Draw AOI
              </Button>
              <button
                type="button"
                onClick={resetAOIsToDefault}
                className="p-1.5 rounded text-content-muted hover:text-content-primary hover:bg-surface-elevated text-2xs flex items-center gap-1 border border-border-subtle transition-colors"
                title="Reset to 5 default benchmark AOIs"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* List of AOIs */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredAOIs.map((aoi) => {
              const isSelected = selectedAoiId === aoi.properties.id;

              return (
                <div
                  key={aoi.properties.id}
                  onClick={() => {
                    selectAOI(aoi.properties.id);
                    fitBounds(aoi.properties.bbox, 60);
                  }}
                  className={cn(
                    "p-3 rounded-lg border text-left cursor-pointer transition-all space-y-2",
                    isSelected
                      ? "bg-accent-primary/10 border-accent-primary ring-1 ring-accent-primary"
                      : "bg-surface-secondary/40 border-border-subtle hover:bg-surface-secondary hover:border-content-muted/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: aoi.properties.color }}
                      />
                      <span className="text-xs font-semibold text-content-primary truncate">
                        {aoi.properties.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleZoomToAOI(e, aoi.properties.bbox, aoi.properties.id)}
                        className="p-1 rounded text-content-muted hover:text-accent-primary transition-colors"
                        title="Zoom to AOI"
                      >
                        <Navigation className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAoiId(aoi.properties.id);
                        }}
                        className="p-1 rounded text-content-muted hover:text-content-primary transition-colors"
                        title="Edit AOI details"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAoiToDelete(aoi.properties.id);
                        }}
                        className="p-1 rounded text-content-muted hover:text-status-danger transition-colors"
                        title="Delete AOI"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {aoi.properties.location && (
                    <div className="text-[11px] text-content-muted truncate">
                      {aoi.properties.location}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-2xs font-mono pt-1 border-t border-border-subtle/50">
                    <span className="text-content-secondary font-medium">
                      {aoi.properties.areaKm2.toLocaleString()} km²
                    </span>
                    <span className="text-content-muted text-[10px]">
                      {aoi.properties.crs.split(" ")[0]}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredAOIs.length === 0 && (
              <div className="py-8 text-center text-xs text-content-muted space-y-2">
                <MapPin className="w-6 h-6 mx-auto opacity-30" />
                <p>No matching AOIs found</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="text-2xs"
                >
                  Clear Filter
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Satellite Scenes */}
      {activeLeftTab === "scenes" && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          <div className="text-2xs font-mono uppercase tracking-wider text-content-muted px-1">
            Curated Satellite Footprints
          </div>

          {scenes.map((scene) => {
            const isSelected = selectedSceneId === scene.properties.id;

            return (
              <div
                key={scene.properties.id}
                onClick={() => {
                  selectScene(scene.properties.id);
                  fitBounds(scene.properties.bbox, 60);
                }}
                className={cn(
                  "p-3 rounded-lg border text-left cursor-pointer transition-all space-y-2",
                  isSelected
                    ? "bg-sky-500/10 border-sky-400 ring-1 ring-sky-400"
                    : "bg-surface-secondary/40 border-border-subtle hover:bg-surface-secondary hover:border-content-muted/30"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-content-primary truncate font-mono">
                      {scene.properties.name}
                    </div>
                    <div className="text-[11px] text-content-secondary">
                      {scene.properties.satellite}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {scene.properties.isBenchmark && (
                      <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                        BENCHMARK
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleZoomToScene(e, scene.properties.bbox, scene.properties.id)}
                      className="p-1 rounded text-content-muted hover:text-accent-primary transition-colors"
                      title="Zoom to Footprint"
                    >
                      <Navigation className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1 text-2xs font-mono border-t border-border-subtle/50 text-content-muted">
                  <div>
                    Bands: <span className="text-content-primary font-medium">{scene.properties.bandsCount}</span>
                  </div>
                  <div>
                    GSD: <span className="text-content-primary font-medium">{scene.properties.spatialResolution}</span>
                  </div>
                  <div>
                    Platform: <span className="text-content-secondary">{scene.properties.platform}</span>
                  </div>
                  <div>
                    Date: <span className="text-content-secondary">{scene.properties.acquisitionDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Layers */}
      {activeLeftTab === "layers" && (
        <div className="flex-1 overflow-y-auto">
          <MapLayerManager />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={aoiToDelete !== null}
        title="Delete Area of Interest"
        message="Are you sure you want to remove this AOI? Any associated spatial queries and boundary settings will be deleted from your workstation."
        confirmLabel="Delete AOI"
        isDestructive
        onConfirm={() => {
          if (aoiToDelete) {
            deleteAOI(aoiToDelete);
            setAoiToDelete(null);
          }
        }}
        onCancel={() => setAoiToDelete(null)}
      />
    </div>
  );
};

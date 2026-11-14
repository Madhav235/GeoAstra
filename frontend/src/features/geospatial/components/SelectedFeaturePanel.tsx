/**
 * Right Contextual Feature Inspector Panel
 * Displays detailed spatial attributes, Turf metrics, metadata, intersecting scenes,
 * and quick geospatial actions for the active selection.
 */

import React, { useState } from "react";
import { useGeospatialStore } from "../store/geospatialStore";
import { findIntersectingScenes } from "../services/turfUtils";
import { ConfirmDialog } from "./ConfirmDialog";
import { useMapInstance } from "../hooks/useMapInstance";
import {
  MapPin,
  Compass,
  Navigation,
  Edit2,
  Trash2,
  Download,
  X,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const SelectedFeaturePanel: React.FC = () => {
  const {
    aois,
    scenes,
    selectedAoiId,
    selectedSceneId,
    selectScene,
    clearSelection,
    deleteAOI,
    setEditingAoiId,
  } = useGeospatialStore();

  const { fitBounds } = useMapInstance();
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedAOI = aois.find((a) => a.properties.id === selectedAoiId);
  const selectedScene = scenes.find((s) => s.properties.id === selectedSceneId);

  // Overlapping scenes for this AOI
  const intersectingScenes = selectedAOI
    ? findIntersectingScenes(selectedAOI, scenes)
    : [];

  const handleExportGeoJSON = () => {
    if (!selectedAOI) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(selectedAOI, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute(
      "download",
      `${selectedAOI.properties.name.toLowerCase().replace(/\s+/g, "_")}.geojson`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-80 shrink-0 h-full flex flex-col bg-surface-main/95 border-l border-border-subtle z-20 backdrop-blur-md">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between bg-surface-secondary/50">
        <div className="flex items-center gap-2">
          {selectedAOI ? (
            <MapPin className="w-4 h-4 text-accent-primary" />
          ) : selectedScene ? (
            <Compass className="w-4 h-4 text-sky-400" />
          ) : (
            <Layers className="w-4 h-4 text-content-muted" />
          )}
          <span className="text-xs font-semibold text-content-primary">
            {selectedAOI
              ? "AOI Inspector"
              : selectedScene
              ? "Scene Footprint Inspector"
              : "Feature Inspector"}
          </span>
        </div>

        <button
          type="button"
          onClick={clearSelection}
          className="p-1 rounded text-content-muted hover:text-content-primary transition-colors"
          title="Deselect"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Scenario 1: AOI is Selected */}
        {selectedAOI && (
          <div className="space-y-4">
            {/* Title & Status */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: selectedAOI.properties.color }}
                />
                <h3 className="text-sm font-semibold text-content-primary leading-tight">
                  {selectedAOI.properties.name}
                </h3>
              </div>
              {selectedAOI.properties.location && (
                <p className="text-2xs text-content-secondary">
                  {selectedAOI.properties.location}
                </p>
              )}
              {selectedAOI.properties.description && (
                <p className="text-2xs text-content-muted pt-1 leading-relaxed">
                  {selectedAOI.properties.description}
                </p>
              )}
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-2xs h-7"
                leftIcon={<Navigation className="w-3 h-3 text-accent-primary" />}
                onClick={() => fitBounds(selectedAOI.properties.bbox, 60)}
              >
                Fit Bounds
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-2xs h-7"
                leftIcon={<Edit2 className="w-3 h-3" />}
                onClick={() => setEditingAoiId(selectedAOI.properties.id)}
              >
                Edit Metadata
              </Button>
            </div>

            {/* Spatial Metrics Card */}
            <div className="p-3 rounded-lg bg-surface-secondary/70 border border-border-subtle space-y-2.5">
              <div className="text-2xs font-mono uppercase tracking-wider text-content-muted">
                Spatial Measurements
              </div>

              <div className="grid grid-cols-2 gap-2 text-2xs font-mono">
                <div>
                  <span className="text-content-muted block">Area (km²):</span>
                  <span className="text-accent-primary font-semibold text-xs">
                    {selectedAOI.properties.areaKm2.toLocaleString()} km²
                  </span>
                </div>
                <div>
                  <span className="text-content-muted block">Perimeter:</span>
                  <span className="text-content-primary font-semibold text-xs">
                    {selectedAOI.properties.perimeterKm.toLocaleString()} km
                  </span>
                </div>
                <div>
                  <span className="text-content-muted block">CRS / Datum:</span>
                  <span className="text-content-secondary truncate block">
                    {selectedAOI.properties.crs}
                  </span>
                </div>
                <div>
                  <span className="text-content-muted block">Centroid:</span>
                  <span className="text-content-secondary truncate block">
                    {selectedAOI.properties.centroid[1].toFixed(4)}°, {selectedAOI.properties.centroid[0].toFixed(4)}°
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-border-subtle/60 text-[10px] font-mono text-content-muted">
                <div>BBOX: [{selectedAOI.properties.bbox.join(", ")}]</div>
              </div>
            </div>

            {/* Intersecting Scenes Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-mono uppercase tracking-wider text-content-muted">
                  Intersecting Scenes ({intersectingScenes.length})
                </span>
              </div>

              {intersectingScenes.length > 0 ? (
                <div className="space-y-2">
                  {intersectingScenes.map((scene) => (
                    <div
                      key={scene.properties.id}
                      onClick={() => {
                        selectScene(scene.properties.id);
                        fitBounds(scene.properties.bbox, 60);
                      }}
                      className="p-2.5 rounded-md bg-surface-secondary/40 border border-border-subtle hover:border-sky-400 hover:bg-sky-500/5 cursor-pointer transition-all space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-content-primary font-mono truncate">
                          {scene.properties.name}
                        </span>
                        {scene.properties.isBenchmark && (
                          <span className="text-[9px] font-mono text-sky-400 px-1 rounded bg-sky-500/10">
                            BENCHMARK
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-2xs text-content-muted font-mono">
                        <span>{scene.properties.satellite}</span>
                        <span>{scene.properties.spatialResolution}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-md bg-surface-panel border border-border-subtle text-2xs text-content-muted text-center">
                  No registered scenes currently overlap this AOI boundary.
                </div>
              )}
            </div>

            {/* Metadata Timestamps */}
            <div className="pt-2 border-t border-border-subtle text-2xs font-mono text-content-muted space-y-1">
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="text-content-secondary">
                  {new Date(selectedAOI.properties.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span className="text-content-secondary">
                  {new Date(selectedAOI.properties.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Bottom Actions: GeoJSON export and Delete */}
            <div className="pt-2 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-2xs h-7.5"
                leftIcon={<Download className="w-3 h-3" />}
                onClick={handleExportGeoJSON}
              >
                Export GeoJSON
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-2xs h-7.5 text-status-danger hover:bg-status-danger/10"
                leftIcon={<Trash2 className="w-3 h-3" />}
                onClick={() => setIsDeleting(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Scenario 2: Satellite Scene is Selected */}
        {selectedScene && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-mono text-sky-400 uppercase tracking-wider">
                  Hyperspectral Datacube
                </span>
                {selectedScene.properties.isBenchmark && (
                  <Badge variant="primary" size="sm">
                    BENCHMARK
                  </Badge>
                )}
              </div>
              <h3 className="text-sm font-semibold text-content-primary font-mono leading-tight">
                {selectedScene.properties.name}
              </h3>
              <p className="text-2xs text-content-secondary">
                {selectedScene.properties.satellite} ({selectedScene.properties.platform})
              </p>
            </div>

            {/* Quick Action */}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-2xs h-7"
              leftIcon={<Navigation className="w-3 h-3 text-sky-400" />}
              onClick={() => fitBounds(selectedScene.properties.bbox, 60)}
            >
              Fit Viewport to Footprint
            </Button>

            {/* Sensor Specifications Card */}
            <div className="p-3 rounded-lg bg-surface-secondary/70 border border-border-subtle space-y-2.5">
              <div className="text-2xs font-mono uppercase tracking-wider text-content-muted">
                Spectral &amp; Sensor Telemetry
              </div>

              <div className="grid grid-cols-2 gap-2 text-2xs font-mono">
                <div>
                  <span className="text-content-muted block">Spectral Bands:</span>
                  <span className="text-accent-primary font-semibold text-xs">
                    {selectedScene.properties.bandsCount} Bands
                  </span>
                </div>
                <div>
                  <span className="text-content-muted block">Ground Sample (GSD):</span>
                  <span className="text-content-primary font-semibold text-xs">
                    {selectedScene.properties.spatialResolution}
                  </span>
                </div>
                <div>
                  <span className="text-content-muted block">Spectral Range:</span>
                  <span className="text-content-secondary block">
                    {selectedScene.properties.spectralRange}
                  </span>
                </div>
                <div>
                  <span className="text-content-muted block">Acquisition Date:</span>
                  <span className="text-content-secondary block">
                    {selectedScene.properties.acquisitionDate}
                  </span>
                </div>
                <div>
                  <span className="text-content-muted block">Cloud Cover:</span>
                  <span className="text-status-success font-medium">
                    {selectedScene.properties.cloudCover.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-content-muted block">Calibration:</span>
                  <span className="text-content-primary font-medium">
                    {selectedScene.properties.status}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-border-subtle/60 text-[10px] font-mono text-content-muted">
                <div>CRS: {selectedScene.properties.crs}</div>
                <div>CENTROID: {selectedScene.properties.centroid.join(", ")}</div>
              </div>
            </div>

            <div className="p-3 rounded-md bg-accent-primary/5 border border-accent-primary/20 text-2xs text-content-secondary leading-relaxed space-y-1">
              <div className="font-semibold text-accent-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Benchmark Calibration
              </div>
              <p>
                This dataset includes calibrated surface reflectance bands suitable for Constrained Energy Minimization (CEM) and Matched Filter target detection.
              </p>
            </div>
          </div>
        )}

        {/* Scenario 3: Nothing Selected (Workstation Hub) */}
        {!selectedAOI && !selectedScene && (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-surface-secondary/80 border border-border-subtle flex items-center justify-center mx-auto text-content-muted">
              <Compass className="w-6 h-6 text-accent-primary" />
            </div>

            <div className="space-y-1 px-4">
              <h4 className="text-xs font-semibold text-content-primary">
                Spatial Feature Inspector
              </h4>
              <p className="text-2xs text-content-muted leading-relaxed">
                Click any AOI polygon or scene footprint on the map, or select one from the left sidebar to inspect spatial telemetry.
              </p>
            </div>

            <div className="pt-3 border-t border-border-subtle space-y-2 text-left px-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-content-muted px-1">
                Quick Benchmark Jump
              </div>
              {scenes.slice(0, 3).map((s) => (
                <button
                  key={s.properties.id}
                  type="button"
                  onClick={() => {
                    selectScene(s.properties.id);
                    fitBounds(s.properties.bbox, 60);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded bg-surface-secondary/40 border border-border-subtle hover:bg-surface-secondary text-2xs font-mono text-content-secondary hover:text-content-primary transition-colors"
                >
                  <span className="truncate">{s.properties.name}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 ml-1 text-content-muted" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleting}
        title="Delete Area of Interest"
        message={`Are you sure you want to delete "${selectedAOI?.properties.name}"? This action cannot be undone.`}
        confirmLabel="Delete AOI"
        isDestructive
        onConfirm={() => {
          if (selectedAOI) {
            deleteAOI(selectedAOI.properties.id);
            setIsDeleting(false);
          }
        }}
        onCancel={() => setIsDeleting(false)}
      />
    </div>
  );
};

/**
 * AOI Creation & Edit Form Modal
 * Prompts user for AOI Name, Description, and Color Swatch.
 * Displays calculated Turf area (km² and Ha) and perimeter (km).
 */

import React, { useState, useEffect } from "react";
import { useGeospatialStore } from "../store/geospatialStore";
import { calculateSpatialMetrics } from "../services/turfUtils";
import { AOIFeature } from "../types/geospatial.types";
import { Button } from "@/components/ui/Button";
import { X, MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const COLOR_SWATCHES = [
  { name: "Amber", value: "#F59E0B" },
  { name: "Sky", value: "#38BDF8" },
  { name: "Emerald", value: "#10B981" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Purple", value: "#A855F7" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Orange", value: "#FB923C" },
];

export const AOIFormModal: React.FC = () => {
  const {
    pendingFeatureForModal,
    setPendingFeatureForModal,
    editingAoiId,
    setEditingAoiId,
    aois,
    addAOI,
    updateAOI,
  } = useGeospatialStore();

  const isEditing = Boolean(editingAoiId);
  const existingAoi = isEditing ? aois.find((a) => a.properties.id === editingAoiId) : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#F59E0B");
  const [error, setError] = useState<string | null>(null);

  // Compute spatial metrics if there's a pending feature or existing AOI
  const metrics = pendingFeatureForModal
    ? calculateSpatialMetrics(pendingFeatureForModal)
    : existingAoi
    ? {
        areaKm2: existingAoi.properties.areaKm2,
        areaHa: Math.round(existingAoi.properties.areaKm2 * 100),
        perimeterKm: existingAoi.properties.perimeterKm,
        centroid: existingAoi.properties.centroid,
        bbox: existingAoi.properties.bbox,
      }
    : null;

  useEffect(() => {
    if (existingAoi) {
      setName(existingAoi.properties.name);
      setDescription(existingAoi.properties.description || "");
      setColor(existingAoi.properties.color || "#F59E0B");
    } else if (pendingFeatureForModal) {
      setName(`AOI Sector ${aois.length + 1}`);
      setDescription("");
      setColor(COLOR_SWATCHES[(aois.length) % COLOR_SWATCHES.length].value);
    }
    setError(null);
  }, [existingAoi, pendingFeatureForModal, aois.length]);

  if (!pendingFeatureForModal && !editingAoiId) {
    return null;
  }

  const handleClose = () => {
    setPendingFeatureForModal(null);
    setEditingAoiId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide an AOI designation or title");
      return;
    }

    if (isEditing && editingAoiId) {
      updateAOI(editingAoiId, {
        name: name.trim(),
        description: description.trim(),
        color,
      });
      handleClose();
      return;
    }

    if (pendingFeatureForModal && metrics) {
      const newId = `aoi-custom-${Date.now()}`;
      const now = new Date().toISOString();

      const newAoi: AOIFeature = {
        type: "Feature",
        geometry: pendingFeatureForModal.geometry,
        properties: {
          id: newId,
          name: name.trim(),
          description: description.trim(),
          color,
          areaKm2: metrics.areaKm2,
          perimeterKm: metrics.perimeterKm,
          crs: "EPSG:4326 (WGS84)",
          createdAt: now,
          updatedAt: now,
          centroid: metrics.centroid,
          bbox: metrics.bbox,
        },
      };

      addAOI(newAoi);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-surface-elevated border border-border-subtle rounded-xl shadow-2xl overflow-hidden space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle bg-surface-secondary/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-accent-primary/10 text-accent-primary">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-content-primary">
                {isEditing ? "Edit Area of Interest" : "Save Drawn Area of Interest"}
              </h3>
              <p className="text-2xs text-content-muted">
                {isEditing ? "Update metadata and visual styling" : "Polygon geometry captured from interactive map"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-content-muted hover:text-content-primary transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Calculated Spatial Metrics Summary */}
        {metrics && (
          <div className="mx-5 p-3 rounded-lg bg-surface-panel border border-border-subtle grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-[10px] font-mono uppercase text-content-muted">Calculated Area</div>
              <div className="text-sm font-semibold text-accent-primary font-mono mt-0.5">
                {metrics.areaKm2.toLocaleString()} <span className="text-xs">km²</span>
              </div>
              <div className="text-[10px] text-content-muted">({metrics.areaHa.toLocaleString()} ha)</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-content-muted">Perimeter</div>
              <div className="text-sm font-semibold text-content-primary font-mono mt-0.5">
                {metrics.perimeterKm.toLocaleString()} <span className="text-xs">km</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-content-muted">Centroid</div>
              <div className="text-2xs font-mono text-content-secondary mt-1">
                {metrics.centroid[1].toFixed(3)}°, {metrics.centroid[0].toFixed(3)}°
              </div>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSave} className="px-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-content-secondary mb-1">
              AOI Name / Identifier <span className="text-status-danger">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Permian Basin Pad 14..."
              className={cn(
                "w-full h-8.5 px-3 bg-surface-secondary/70 border rounded-md text-xs text-content-primary",
                "focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary",
                error ? "border-status-danger" : "border-border-subtle"
              )}
              autoFocus
            />
            {error && <p className="text-2xs text-status-danger mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-content-secondary mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Target plume monitoring, pipeline right-of-way, mineral alteration zone..."
              className="w-full px-3 py-2 bg-surface-secondary/70 border border-border-subtle rounded-md text-xs text-content-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary resize-none"
            />
          </div>

          {/* Color Tag Picker */}
          <div>
            <label className="block text-xs font-medium text-content-secondary mb-1.5">
              Symbology Color Swatch
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch.value}
                  type="button"
                  onClick={() => setColor(swatch.value)}
                  className={cn(
                    "w-7 h-7 rounded-md border flex items-center justify-center transition-transform hover:scale-105",
                    color === swatch.value
                      ? "border-white ring-2 ring-accent-primary scale-110"
                      : "border-border-subtle hover:border-content-muted"
                  )}
                  style={{ backgroundColor: swatch.value }}
                  title={swatch.name}
                >
                  {color === swatch.value && <Check className="w-3.5 h-3.5 text-black font-bold" />}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 pb-2 border-t border-border-subtle">
            <Button variant="ghost" size="sm" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {isEditing ? "Save Changes" : "Save Area of Interest"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

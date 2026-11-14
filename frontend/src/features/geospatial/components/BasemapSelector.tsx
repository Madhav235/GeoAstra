/**
 * Basemap Selector Component
 * Allows switching between Dark Matter, OpenStreetMap, World Imagery, and OpenTopoMap
 * without losing vector overlays or feature state.
 */

import React, { useState, useRef, useEffect } from "react";
import { useGeospatialStore } from "../store/geospatialStore";
import { BASEMAPS } from "../data/basemaps";
import { BasemapId } from "../types/geospatial.types";
import { Map as MapIcon, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const BasemapSelector: React.FC = () => {
  const { activeBasemap, setBasemap } = useGeospatialStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = BASEMAPS[activeBasemap];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
          "bg-surface-elevated/90 hover:bg-surface-elevated text-content-primary border-border-subtle",
          isOpen && "border-accent-primary ring-1 ring-accent-primary"
        )}
        title="Change Basemap"
      >
        <MapIcon className="w-3.5 h-3.5 text-accent-primary shrink-0" />
        <span className="hidden sm:inline text-content-secondary">Basemap:</span>
        <span className="font-semibold text-content-primary">{current.name}</span>
        <ChevronDown className="w-3 h-3 text-content-muted ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-60 rounded-lg bg-surface-elevated border border-border-subtle shadow-xl p-1.5 z-50 space-y-1 backdrop-blur-md">
          <div className="px-2 py-1 text-2xs font-mono uppercase tracking-wider text-content-muted border-b border-border-subtle mb-1">
            Standard Cartography
          </div>
          {(Object.keys(BASEMAPS) as BasemapId[]).map((id) => {
            const config = BASEMAPS[id];
            const isSelected = activeBasemap === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setBasemap(id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs transition-colors",
                  isSelected
                    ? "bg-accent-primary/15 text-accent-primary font-medium"
                    : "text-content-secondary hover:bg-surface-panel hover:text-content-primary"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-4 h-4 rounded border border-border-subtle shrink-0"
                    style={{ backgroundColor: config.previewColor }}
                  />
                  <div className="text-left">
                    <div className="font-medium">{config.name}</div>
                    <div className="text-2xs text-content-muted line-clamp-1">{config.attribution}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-accent-primary shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};


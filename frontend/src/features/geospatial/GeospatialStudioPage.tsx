/**
 * Geospatial Studio Page
 * Main container for Phase 4: Full-featured interactive geospatial workstation.
 * Integrates MapLibre GL map, Terra Draw polygon creation, Turf.js spatial calculation,
 * Left Workspace Sidebar, Right Feature Inspector, Top Map Toolbar, and Bottom Status Bar.
 */

import React, { useEffect } from "react";
import { useGeospatialStore } from "./store/geospatialStore";
import { useMapInstance } from "./hooks/useMapInstance";
import { MapCanvas } from "./components/MapCanvas";
import { MapToolbar } from "./components/MapToolbar";
import { AOISidebar } from "./components/AOISidebar";
import { SelectedFeaturePanel } from "./components/SelectedFeaturePanel";
import { MapStatusBar } from "./components/MapStatusBar";
import { AOIFormModal } from "./components/AOIFormModal";

export const GeospatialStudioPage: React.FC = () => {
  const { isLeftSidebarOpen, isRightPanelOpen } = useGeospatialStore();
  const { resize } = useMapInstance();

  // Resize map canvas when sidebars toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      resize();
    }, 250);
    return () => clearTimeout(timer);
  }, [isLeftSidebarOpen, isRightPanelOpen, resize]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-surface-main select-none">
      {/* Top Map Toolbar */}
      <MapToolbar />

      {/* Main Workstation Layout */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Left Sidebar: AOIs, Benchmark Scenes, Layer Manager */}
        {isLeftSidebarOpen && <AOISidebar />}

        {/* Center Interactive Map Canvas */}
        <div className="flex-1 h-full relative overflow-hidden">
          <MapCanvas />
        </div>

        {/* Right Panel: Selected Feature Inspector & Actions */}
        {isRightPanelOpen && <SelectedFeaturePanel />}
      </div>

      {/* Bottom Coordinates, Zoom & Symbology HUD */}
      <MapStatusBar />

      {/* AOI Creation & Edit Modal */}
      <AOIFormModal />
    </div>
  );
};


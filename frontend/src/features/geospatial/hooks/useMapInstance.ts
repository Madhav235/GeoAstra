/**
 * Map Instance Hook & Centralized Navigation Controller
 * Provides direct access to the live MapLibre GL instance, TerraDraw instance,
 * and coordinate/bounding box fly-to helpers.
 */

import { useCallback } from "react";
import * as maplibregl from "maplibre-gl";
import { TerraDraw } from "terra-draw";

// Global reference for seamless cross-component communication
let activeMapInstance: maplibregl.Map | null = null;
let activeTerraDrawInstance: TerraDraw | null = null;

export function setMapInstance(map: maplibregl.Map | null) {
  activeMapInstance = map;
}

export function getMapInstance(): maplibregl.Map | null {
  return activeMapInstance;
}

export function setTerraDrawInstance(draw: TerraDraw | null) {
  activeTerraDrawInstance = draw;
}

export function getTerraDrawInstance(): TerraDraw | null {
  return activeTerraDrawInstance;
}

export function useMapInstance() {
  const flyTo = useCallback((center: [number, number], zoom = 10) => {
    if (activeMapInstance) {
      activeMapInstance.flyTo({
        center,
        zoom,
        essential: true,
        duration: 1200,
      });
    }
  }, []);

  const fitBounds = useCallback((bbox: [number, number, number, number], padding = 50) => {
    if (activeMapInstance) {
      activeMapInstance.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        {
          padding: { top: padding, bottom: padding, left: padding, right: padding },
          maxZoom: 14,
          duration: 1200,
        }
      );
    }
  }, []);

  const resetView = useCallback(() => {
    if (activeMapInstance) {
      activeMapInstance.flyTo({
        center: [-40, 28],
        zoom: 3.5,
        pitch: 0,
        bearing: 0,
        duration: 1000,
      });
    }
  }, []);

  const resize = useCallback(() => {
    if (activeMapInstance) {
      activeMapInstance.resize();
    }
  }, []);

  return {
    getMap: getMapInstance,
    getDraw: getTerraDrawInstance,
    flyTo,
    fitBounds,
    resetView,
    resize,
  };
}

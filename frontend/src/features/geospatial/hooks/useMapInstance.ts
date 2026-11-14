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
    const map = activeMapInstance;
    if (!map) return;

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (activeMapInstance !== map) return;
        map.resize();
        const { width, height } = map.getContainer().getBoundingClientRect();
        const horizontalPadding = Math.min(padding, Math.max(0, (width - 24) / 2));
        const verticalPadding = Math.min(padding, Math.max(0, (height - 24) / 2));
        map.fitBounds(
          [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ],
          {
            padding: {
              top: verticalPadding,
              bottom: verticalPadding,
              left: horizontalPadding,
              right: horizontalPadding,
            },
            maxZoom: 14,
            duration: 1200,
          }
        );
      });
    });
  }, []);

  const resetView = useCallback(() => {
    if (activeMapInstance) {
      activeMapInstance.flyTo({
        center: [-48, 8],
        zoom: 2.2,
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

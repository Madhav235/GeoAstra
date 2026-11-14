/**
 * MapCanvas Component
 * Core MapLibre GL spatial canvas powered by OpenFreeMap vector styles (Liberty, Dark, Positron, Bright).
 * Configured with official OpenFreeMap Liberty style URL: https://tiles.openfreemap.org/styles/liberty
 * Requires zero API keys or registration.
 * Custom vector GeoJSON layers (AOIs, Scene Footprints, Detection Overlays),
 * Terra Draw interactive polygon digitizing, and measurement integration.
 */

import React, { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { TerraDraw, TerraDrawPolygonMode, TerraDrawSelectMode, TerraDrawRenderMode } from "terra-draw";
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";
import { useGeospatialStore } from "../store/geospatialStore";
import { BASEMAPS, OPENFREEMAP_ATTRIBUTION } from "../data/basemaps";
import { setMapInstance, setTerraDrawInstance } from "../hooks/useMapInstance";
import { validatePolygonGeometry } from "../services/turfUtils";

// Configure dedicated Web Worker URL to prevent Vite 404 worker loading errors
if (typeof window !== "undefined") {
  maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");
}

export const MapCanvas: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const terraDrawRef = useRef<TerraDraw | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const {
    aois,
    scenes,
    selectedAoiId,
    selectedSceneId,
    selectAOI,
    selectScene,
    activeBasemap,
    layers,
    drawingMode,
    setDrawingMode,
    setCursorCoords,
    setZoom,
    setPendingFeatureForModal,
  } = useGeospatialStore();

  // Keep references to state values for event callbacks
  const aoisRef = useRef(aois);
  aoisRef.current = aois;
  const scenesRef = useRef(scenes);
  scenesRef.current = scenes;
  const layersRef = useRef(layers);
  layersRef.current = layers;
  const selectedAoiIdRef = useRef(selectedAoiId);
  selectedAoiIdRef.current = selectedAoiId;
  const selectedSceneIdRef = useRef(selectedSceneId);
  selectedSceneIdRef.current = selectedSceneId;

  // Track currently applied style URL to avoid redundant setStyle calls
  const currentStyleRef = useRef<string>(BASEMAPS[activeBasemap]?.styleUrl || BASEMAPS.liberty.styleUrl);

  // Helper to re-add all custom GeoJSON vector layers & event handlers onto the active style
  const syncCustomLayers = (map: maplibregl.Map) => {
    if (!map.isStyleLoaded()) return;

    // 1. Scene footprints source & layers
    if (!map.getSource("scenes-source")) {
      map.addSource("scenes-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: scenesRef.current as any,
        },
      });

      map.addLayer({
        id: "scenes-fill",
        type: "fill",
        source: "scenes-source",
        paint: {
          "fill-color": "#38BDF8",
          "fill-opacity": layersRef.current.scenes.visible ? layersRef.current.scenes.opacity * 0.25 : 0,
        },
      });

      map.addLayer({
        id: "scenes-line",
        type: "line",
        source: "scenes-source",
        paint: {
          "line-color": "#38BDF8",
          "line-width": 2,
          "line-opacity": layersRef.current.scenes.visible ? layersRef.current.scenes.opacity : 0,
        },
      });
    }

    // 2. AOIs source & layers
    if (!map.getSource("aois-source")) {
      map.addSource("aois-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: aoisRef.current as any,
        },
      });

      map.addLayer({
        id: "aois-fill",
        type: "fill",
        source: "aois-source",
        paint: {
          "fill-color": ["coalesce", ["get", "color"], "#F59E0B"],
          "fill-opacity": layersRef.current.aois.visible ? layersRef.current.aois.opacity * 0.35 : 0,
        },
      });

      map.addLayer({
        id: "aois-line",
        type: "line",
        source: "aois-source",
        paint: {
          "line-color": ["coalesce", ["get", "color"], "#F59E0B"],
          "line-width": 2.5,
          "line-opacity": layersRef.current.aois.visible ? layersRef.current.aois.opacity : 0,
        },
      });
    }

    // 3. Selection highlight source & layer
    if (!map.getSource("selection-source")) {
      let selectedFeature: any = null;
      if (selectedAoiIdRef.current) {
        selectedFeature = aoisRef.current.find((a) => a.properties.id === selectedAoiIdRef.current);
      } else if (selectedSceneIdRef.current) {
        selectedFeature = scenesRef.current.find((s) => s.properties.id === selectedSceneIdRef.current);
      }

      map.addSource("selection-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: selectedFeature ? [selectedFeature] : [],
        },
      });

      map.addLayer({
        id: "selection-line",
        type: "line",
        source: "selection-source",
        paint: {
          "line-color": "#FFFFFF",
          "line-width": 3,
          "line-dasharray": [2, 2],
          "line-opacity": 0.95,
        },
      });
    }

    // 4. Detection simulation layer
    if (!map.getSource("detections-source")) {
      map.addSource("detections-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [-102.12, 31.95],
                    [-102.08, 31.95],
                    [-102.07, 31.98],
                    [-102.11, 31.99],
                    [-102.12, 31.95],
                  ],
                ],
              },
              properties: {
                name: "Permian Point-Source Methane Anomaly",
                confidence: 0.964,
              },
            },
          ],
        },
      });

      map.addLayer({
        id: "detections-fill",
        type: "fill",
        source: "detections-source",
        paint: {
          "fill-color": "#10B981",
          "fill-opacity": layersRef.current.detections.visible ? layersRef.current.detections.opacity * 0.5 : 0,
        },
      });

      map.addLayer({
        id: "detections-line",
        type: "line",
        source: "detections-source",
        paint: {
          "line-color": "#34D399",
          "line-width": 2,
          "line-opacity": layersRef.current.detections.visible ? layersRef.current.detections.opacity : 0,
        },
      });
    }

    // Interactive pointer styling
    map.on("mouseenter", "aois-fill", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "aois-fill", () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseenter", "scenes-fill", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "scenes-fill", () => {
      map.getCanvas().style.cursor = "";
    });
  };

  // Helper to re-attach TerraDraw on style load
  const initTerraDraw = (map: maplibregl.Map) => {
    try {
      if (terraDrawRef.current) {
        try {
          terraDrawRef.current.stop();
        } catch {}
      }

      const adapter = new TerraDrawMapLibreGLAdapter({ map });
      const draw = new TerraDraw({
        adapter,
        modes: [
          new TerraDrawPolygonMode({
            pointerDistance: 40,
          }),
          new TerraDrawSelectMode({
            flags: {
              polygon: {
                feature: {
                  draggable: true,
                  rotateable: false,
                  scaleable: false,
                  coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true,
                  },
                },
              },
            },
          }),
          new TerraDrawRenderMode({ modeName: "render", styles: {} }),
        ],
      });

      draw.start();
      terraDrawRef.current = draw;
      setTerraDrawInstance(draw);

      draw.on("finish", (id) => {
        const snapshot = draw.getSnapshot();
        const created = snapshot.find((f) => f.id === id);

        if (created && created.geometry.type === "Polygon") {
          const validation = validatePolygonGeometry(created as any);
          if (validation.valid) {
            setPendingFeatureForModal(created as any);
          } else {
            alert(validation.error || "Invalid polygon geometry. Please try again.");
          }
        }
        draw.clear();
        setDrawingMode("idle");
      });
    } catch (err) {
      console.error("Failed to initialize Terra Draw with OpenFreeMap style:", err);
    }
  };

  // Initialize MapLibre GL with OpenFreeMap official Liberty style
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Official OpenFreeMap Liberty style URL as requested: https://tiles.openfreemap.org/styles/liberty
    const initialStyleUrl = BASEMAPS[activeBasemap]?.styleUrl || BASEMAPS.liberty.styleUrl;
    currentStyleRef.current = initialStyleUrl;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyleUrl,
      center: [-40, 25],
      zoom: 3.5,
      pitch: 0,
      bearing: 0,
      attributionControl: { compact: true, customAttribution: OPENFREEMAP_ATTRIBUTION },
    });

    // Map controls
    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        visualizePitch: true,
      }),
      "top-right"
    );

    map.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 140,
        unit: "metric",
      }),
      "bottom-left"
    );

    map.addControl(new maplibregl.FullscreenControl(), "top-right");

    mapRef.current = map;
    setMapInstance(map);

    map.on("error", (e: any) => {
      console.error("MapLibre GL Error:", e.error || e);
    });

    // Map cursor & zoom telemetry listeners
    map.on("mousemove", (e: any) => {
      setCursorCoords({
        lng: Number(e.lngLat.lng.toFixed(5)),
        lat: Number(e.lngLat.lat.toFixed(5)),
      });
    });

    map.on("mouseout", () => {
      setCursorCoords(null);
    });

    map.on("zoom", () => {
      setZoom(Number(map.getZoom().toFixed(1)));
    });

    // Feature Click Listeners
    map.on("click", "aois-fill", (e: any) => {
      if (e.features && e.features[0]) {
        const feature = e.features[0];
        const id = feature.properties?.id;
        if (id) {
          selectAOI(id);
          if (popupRef.current) popupRef.current.remove();
          popupRef.current = new maplibregl.Popup({ closeButton: true, className: "geoastra-popup" })
            .setLngLat(e.lngLat)
            .setHTML(
              `<div class="p-2 space-y-1 font-sans text-xs bg-slate-900 text-slate-100 rounded">
                <div class="font-semibold text-amber-400 flex items-center gap-1.5">
                  <span>${feature.properties?.name}</span>
                </div>
                <div class="text-[11px] text-slate-400">Area: <strong class="text-slate-200">${feature.properties?.areaKm2} km²</strong></div>
                <div class="text-[10px] text-slate-500 font-mono">${feature.properties?.crs}</div>
              </div>`
            )
            .addTo(map);
        }
      }
    });

    map.on("click", "scenes-fill", (e: any) => {
      const aoiFeatures = map.queryRenderedFeatures(e.point, { layers: ["aois-fill"] });
      if (aoiFeatures && aoiFeatures.length > 0) return;

      if (e.features && e.features[0]) {
        const feature = e.features[0];
        const id = feature.properties?.id;
        if (id) {
          selectScene(id);
          if (popupRef.current) popupRef.current.remove();
          popupRef.current = new maplibregl.Popup({ closeButton: true, className: "geoastra-popup" })
            .setLngLat(e.lngLat)
            .setHTML(
              `<div class="p-2 space-y-1 font-sans text-xs bg-slate-900 text-slate-100 rounded">
                <div class="font-semibold text-sky-400 flex items-center gap-1.5 font-mono">
                  <span>${feature.properties?.name}</span>
                </div>
                <div class="text-[11px] text-slate-400">${feature.properties?.satellite} (${feature.properties?.spatialResolution})</div>
                <div class="text-[10px] text-slate-400 font-mono">${feature.properties?.bandsCount} Bands • ${feature.properties?.spectralRange}</div>
              </div>`
            )
            .addTo(map);
        }
      }
    });

    // On initial map load
    map.on("load", () => {
      map.resize();
    });

    // On style load (fires on initial load and every subsequent setStyle call)
    map.on("style.load", () => {
      syncCustomLayers(map);
      initTerraDraw(map);
      map.resize();
    });

    return () => {
      if (terraDrawRef.current) {
        try {
          terraDrawRef.current.stop();
        } catch {}
      }
      map.remove();
      setMapInstance(null);
      setTerraDrawInstance(null);
    };
  }, []);

  // Update Basemap Style dynamically using OpenFreeMap official styles
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const targetStyle = BASEMAPS[activeBasemap]?.styleUrl || BASEMAPS.liberty.styleUrl;
    // Only call setStyle if the active style URL actually changed
    if (targetStyle !== currentStyleRef.current) {
      currentStyleRef.current = targetStyle;
      map.setStyle(targetStyle);
    }
  }, [activeBasemap]);

  // Sync AOIs GeoJSON data to MapLibre source
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const aoiSource = map.getSource("aois-source") as maplibregl.GeoJSONSource;
    if (aoiSource) {
      aoiSource.setData({
        type: "FeatureCollection",
        features: aois as any,
      });
    }
  }, [aois]);

  // Sync Scenes GeoJSON data to MapLibre source
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const scenesSource = map.getSource("scenes-source") as maplibregl.GeoJSONSource;
    if (scenesSource) {
      scenesSource.setData({
        type: "FeatureCollection",
        features: scenes as any,
      });
    }
  }, [scenes]);

  // Sync Selected Feature Highlight
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const selSource = map.getSource("selection-source") as maplibregl.GeoJSONSource;
    if (!selSource) return;

    let selectedFeature: any = null;
    if (selectedAoiId) {
      selectedFeature = aois.find((a) => a.properties.id === selectedAoiId);
    } else if (selectedSceneId) {
      selectedFeature = scenes.find((s) => s.properties.id === selectedSceneId);
    }

    selSource.setData({
      type: "FeatureCollection",
      features: selectedFeature ? [selectedFeature] : [],
    });
  }, [selectedAoiId, selectedSceneId, aois, scenes]);

  // Update Layer Opacities and Visibilities
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // AOIs
    if (map.getLayer("aois-fill")) {
      map.setPaintProperty(
        "aois-fill",
        "fill-opacity",
        layers.aois.visible ? layers.aois.opacity * 0.35 : 0
      );
      map.setPaintProperty(
        "aois-line",
        "line-opacity",
        layers.aois.visible ? layers.aois.opacity : 0
      );
    }

    // Scenes
    if (map.getLayer("scenes-fill")) {
      map.setPaintProperty(
        "scenes-fill",
        "fill-opacity",
        layers.scenes.visible ? layers.scenes.opacity * 0.25 : 0
      );
      map.setPaintProperty(
        "scenes-line",
        "line-opacity",
        layers.scenes.visible ? layers.scenes.opacity : 0
      );
    }

    // Detections
    if (map.getLayer("detections-fill")) {
      map.setPaintProperty(
        "detections-fill",
        "fill-opacity",
        layers.detections.visible ? layers.detections.opacity * 0.5 : 0
      );
      map.setPaintProperty(
        "detections-line",
        "line-opacity",
        layers.detections.visible ? layers.detections.opacity : 0
      );
    }
  }, [layers]);

  // Sync Terra Draw Mode
  useEffect(() => {
    const draw = terraDrawRef.current;
    if (!draw) return;

    try {
      if (drawingMode === "drawing") {
        draw.setMode("polygon");
      } else if (drawingMode === "editing") {
        draw.setMode("select");
      } else {
        draw.setMode("render");
      }
    } catch (err) {
      console.warn("Could not set Terra Draw mode:", err);
    }
  }, [drawingMode]);

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden bg-surface-main">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

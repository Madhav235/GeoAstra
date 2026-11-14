/**
 * MapCanvas Component
 * Core MapLibre GL spatial canvas with multi-basemap raster support,
 * custom vector GeoJSON layers (AOIs, Scene Footprints, Detection Overlays),
 * Terra Draw interactive polygon digitizing, and measurement integration.
 */

import React, { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { TerraDraw, TerraDrawPolygonMode, TerraDrawSelectMode, TerraDrawRenderMode } from "terra-draw";
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";
import { useGeospatialStore } from "../store/geospatialStore";
import { BASEMAPS } from "../data/basemaps";
import { setMapInstance, setTerraDrawInstance } from "../hooks/useMapInstance";
import { validatePolygonGeometry } from "../services/turfUtils";

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

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialBasemap = BASEMAPS[activeBasemap];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          "base-tiles": {
            type: "raster",
            tiles: initialBasemap.tiles,
            tileSize: 256,
            attribution: initialBasemap.attribution,
            maxzoom: initialBasemap.maxZoom,
          },
        },
        layers: [
          {
            id: "base-layer",
            type: "raster",
            source: "base-tiles",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [-40, 25],
      zoom: 3.5,
      pitch: 0,
      bearing: 0,
      attributionControl: { compact: true },
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

    // On style load, configure GeoJSON vector layers & Terra Draw
    map.on("load", () => {
      // 1. Scene footprints source & layers
      if (!map.getSource("scenes-source")) {
        map.addSource("scenes-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: scenes as any,
          },
        });

        map.addLayer({
          id: "scenes-fill",
          type: "fill",
          source: "scenes-source",
          paint: {
            "fill-color": "#38BDF8",
            "fill-opacity": layers.scenes.visible ? layers.scenes.opacity * 0.25 : 0,
          },
        });

        map.addLayer({
          id: "scenes-line",
          type: "line",
          source: "scenes-source",
          paint: {
            "line-color": "#38BDF8",
            "line-width": 2,
            "line-opacity": layers.scenes.visible ? layers.scenes.opacity : 0,
          },
        });
      }

      // 2. AOIs source & layers
      if (!map.getSource("aois-source")) {
        map.addSource("aois-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: aois as any,
          },
        });

        map.addLayer({
          id: "aois-fill",
          type: "fill",
          source: "aois-source",
          paint: {
            "fill-color": ["coalesce", ["get", "color"], "#F59E0B"],
            "fill-opacity": layers.aois.visible ? layers.aois.opacity * 0.35 : 0,
          },
        });

        map.addLayer({
          id: "aois-line",
          type: "line",
          source: "aois-source",
          paint: {
            "line-color": ["coalesce", ["get", "color"], "#F59E0B"],
            "line-width": 2.5,
            "line-opacity": layers.aois.visible ? layers.aois.opacity : 0,
          },
        });
      }

      // 3. Selection highlight source & layer
      if (!map.getSource("selection-source")) {
        map.addSource("selection-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
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

      // 4. Detection Heatmap simulation layer (Permian Basin plume hotspot)
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
            "fill-opacity": layers.detections.visible ? layers.detections.opacity * 0.5 : 0,
          },
        });

        map.addLayer({
          id: "detections-line",
          type: "line",
          source: "detections-source",
          paint: {
            "line-color": "#34D399",
            "line-width": 2,
            "line-opacity": layers.detections.visible ? layers.detections.opacity : 0,
          },
        });
      }

      // Interactive hover pointers
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

      // Feature Click Listeners
      map.on("click", "aois-fill", (e: any) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const id = feature.properties?.id;
          if (id) {
            selectAOI(id);
            // Show interactive popup
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
        // If an AOI was clicked at the same spot, AOI takes precedence
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

      // Initialize Terra Draw
      try {
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

        // Polygon drawing completion listener
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
        console.error("Failed to initialize Terra Draw:", err);
      }
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

  // Update Basemap Tiles dynamically without reloading map or layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource("base-tiles") as maplibregl.RasterTileSource;
    if (source && source.setTiles) {
      source.setTiles(BASEMAPS[activeBasemap].tiles);
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

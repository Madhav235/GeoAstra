import React, { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FeatureCollection, Point } from "geojson";
import { AOIFeature, SceneFeature } from "@/features/geospatial/types/geospatial.types";
import { BASEMAPS, OPENFREEMAP_ATTRIBUTION } from "@/features/geospatial/data/basemaps";
import { DemoDetectionFeature, DemoResultFixture } from "../types";

if (typeof window !== "undefined") maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");

export interface ResultsMapLayers {
  heatmap: boolean;
  polygons: boolean;
  aoi: boolean;
  scene: boolean;
}

interface ResultsMapProps {
  fixture: DemoResultFixture;
  aoi?: AOIFeature;
  sceneFootprint?: SceneFeature;
  layers: ResultsMapLayers;
  heatmapOpacity: number;
  polygonOpacity: number;
  selectedId: string | null;
  onSelect: (feature: DemoDetectionFeature | null) => void;
}

interface ResultMarker {
  id: string;
  marker: maplibregl.Marker;
}

export const ResultsMap: React.FC<ResultsMapProps> = ({
  fixture,
  aoi,
  sceneFootprint,
  layers,
  heatmapOpacity,
  polygonOpacity,
  selectedId,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<ResultMarker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const selectedRef = useRef(selectedId);
  const onSelectRef = useRef(onSelect);
  selectedRef.current = selectedId;
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: BASEMAPS.liberty.styleUrl,
      center: [-48, 8],
      zoom: 3,
      attributionControl: { compact: true, customAttribution: OPENFREEMAP_ATTRIBUTION },
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), "top-right");
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 140, unit: "metric" }), "bottom-left");

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(containerRef.current);
    map.on("error", (event) => {
      const message = event.error?.message ?? "The map style or map source could not be initialized.";
      setMapError(message);
      console.error("Results map initialization/render error:", event.error ?? event);
    });
    map.on("load", () => {
      if (disposed) return;
      try {
        map.addSource("results-heatmap-source", { type: "geojson", data: fixture.heatmap as FeatureCollection<Point> });
        map.addLayer({
          id: "results-heatmap",
          type: "heatmap",
          source: "results-heatmap-source",
          maxzoom: 14,
          paint: {
            "heatmap-weight": ["get", "intensity"],
            "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 0.7, 9, 1.4],
            "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 18, 12, 48],
            "heatmap-opacity": 0.68,
            "heatmap-color": [
              "interpolate", ["linear"], ["heatmap-density"],
              0, "rgba(34, 211, 238, 0)",
              0.2, "#22d3ee",
              0.45, "#34d399",
              0.7, "#facc15",
              1, "#f43f5e",
            ],
          },
        });
        markersRef.current = fixture.features.features.map((feature) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "results-detection-marker";
          button.setAttribute("aria-label", `Select detection ${feature.properties.detectionId}`);
          button.setAttribute("aria-pressed", String(selectedRef.current === feature.properties.id));
          button.title = `${feature.properties.detectionId} · illustrative score ${feature.properties.score.toFixed(3)}`;
          button.textContent = feature.properties.detectionId.slice(-2);
          Object.assign(button.style, {
            width: "28px",
            height: "28px",
            borderRadius: "9999px",
            border: "2px solid #f8fafc",
            background: "#0f172a",
            color: "#e2e8f0",
            font: "600 9px ui-monospace, monospace",
            cursor: "pointer",
            boxShadow: "0 1px 5px rgba(0,0,0,.7)",
          });
          button.addEventListener("click", (event) => {
            event.stopPropagation();
            onSelectRef.current(feature as DemoDetectionFeature);
          });
          const marker = new maplibregl.Marker({ element: button, anchor: "center" })
            .setLngLat(feature.properties.centroid ?? [0, 0])
            .addTo(map);
          return { id: feature.properties.id, marker };
        });
        map.addSource("results-detections-source", { type: "geojson", data: fixture.features });
        map.addLayer({
          id: "results-detections-fill",
          type: "fill",
          source: "results-detections-source",
          paint: {
            "fill-color": ["interpolate", ["linear"], ["get", "score"], 0.5, "#22d3ee", 0.75, "#facc15", 1, "#fb7185"],
            "fill-opacity": 0.55,
          },
        });
        map.addLayer({
          id: "results-detections-line",
          type: "line",
          source: "results-detections-source",
          paint: { "line-color": "#f8fafc", "line-width": 1.2, "line-opacity": 0.9 },
        });
        map.addLayer({
          id: "results-detections-selected",
          type: "line",
          source: "results-detections-source",
          filter: ["==", ["get", "id"], selectedRef.current ?? ""],
          paint: { "line-color": "#22d3ee", "line-width": 4, "line-opacity": 1 },
        });
        map.addSource("results-detection-centers-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: fixture.features.features.map((feature) => ({
              type: "Feature" as const,
              geometry: { type: "Point" as const, coordinates: feature.properties.centroid ?? [0, 0] },
              properties: { id: feature.properties.id, score: feature.properties.score },
            })),
          },
        });
        map.addLayer({
          id: "results-detection-centers",
          type: "circle",
          source: "results-detection-centers-source",
          paint: {
            "circle-radius": 6,
            "circle-color": ["interpolate", ["linear"], ["get", "score"], 0.5, "#22d3ee", 0.75, "#facc15", 1, "#fb7185"],
            "circle-stroke-color": "#f8fafc",
            "circle-stroke-width": 1.5,
            "circle-opacity": 0.92,
          },
        });

        if (aoi) {
          map.addSource("results-aoi-source", { type: "geojson", data: aoi });
          map.addLayer({
            id: "results-aoi-fill",
            type: "fill",
            source: "results-aoi-source",
            paint: { "fill-color": "#f59e0b", "fill-opacity": 0.06 },
          });
          map.addLayer({
            id: "results-aoi-line",
            type: "line",
            source: "results-aoi-source",
            paint: { "line-color": "#f59e0b", "line-width": 2, "line-dasharray": [2, 1] },
          });
        }
        if (sceneFootprint) {
          map.addSource("results-scene-source", { type: "geojson", data: sceneFootprint });
          map.addLayer({
            id: "results-scene-line",
            type: "line",
            source: "results-scene-source",
            paint: { "line-color": "#38bdf8", "line-width": 2, "line-dasharray": [1, 2] },
          });
        }

        map.on("click", (event) => {
          const layersAtPoint = ["results-detection-centers", "results-detections-fill"]
            .filter((layerId) => map.getLayer(layerId));
          const feature = map.isStyleLoaded() && layersAtPoint.length
            ? map.queryRenderedFeatures(event.point, { layers: layersAtPoint })[0]
            : undefined;
          if (!feature) {
            onSelectRef.current(null);
            return;
          }
          const selected = fixture.features.features.find((item) => item.properties.id === feature.properties?.id);
          if (selected) onSelectRef.current(selected as DemoDetectionFeature);
          else onSelectRef.current(null);
        });
        for (const layer of ["results-detections-fill", "results-detection-centers"]) {
          map.on("mouseenter", layer, () => { map.getCanvas().style.cursor = "pointer"; });
          map.on("mouseleave", layer, () => { map.getCanvas().style.cursor = ""; });
        }
        const bounds: [number, number, number, number] | undefined = aoi
          ? aoi.properties.bbox
          : sceneFootprint?.properties.bbox;
        if (bounds?.length === 4) {
          map.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]], { padding: 60, maxZoom: 14, duration: 0 });
        }
        setMapLoaded(true);
        requestAnimationFrame(() => map.resize());
      } catch (error) {
        const message = error instanceof Error ? error.message : "Map layers could not be created.";
        setMapError(message);
        console.error("Results map layer initialization failed:", error);
      }
    });

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [aoi, fixture, sceneFootprint]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !map.getLayer("results-heatmap")) return;
    const update = () => {
      if (!map.isStyleLoaded()) return;
      if (map.getLayer("results-heatmap")) map.setLayoutProperty("results-heatmap", "visibility", layers.heatmap ? "visible" : "none");
      for (const id of ["results-detections-fill", "results-detections-line", "results-detections-selected", "results-detection-centers"]) {
        if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", layers.polygons ? "visible" : "none");
      }
      if (map.getLayer("results-aoi-line")) {
        map.setLayoutProperty("results-aoi-line", "visibility", layers.aoi ? "visible" : "none");
        map.setLayoutProperty("results-aoi-fill", "visibility", layers.aoi ? "visible" : "none");
      }
      if (map.getLayer("results-scene-line")) map.setLayoutProperty("results-scene-line", "visibility", layers.scene ? "visible" : "none");
      markersRef.current.forEach(({ marker }) => {
        marker.getElement().style.display = layers.polygons ? "" : "none";
      });
    };
    if (map.isStyleLoaded()) update();
    else map.once("idle", update);
    return () => { map.off("idle", update); };
  }, [layers, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    const update = () => {
      if (!map.isStyleLoaded()) return;
      if (map.getLayer("results-heatmap")) map.setPaintProperty("results-heatmap", "heatmap-opacity", heatmapOpacity);
      if (map.getLayer("results-detections-fill")) map.setPaintProperty("results-detections-fill", "fill-opacity", polygonOpacity);
    };
    if (map.isStyleLoaded()) update();
    else map.once("idle", update);
    return () => { map.off("idle", update); };
  }, [heatmapOpacity, mapLoaded, polygonOpacity]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    const update = () => {
      if (map.isStyleLoaded() && map.getLayer("results-detections-selected")) {
        map.setFilter("results-detections-selected", ["==", ["get", "id"], selectedId ?? ""]);
      }
      markersRef.current.forEach(({ id, marker }) => {
        const element = marker.getElement();
        const selected = id === selectedId;
        element.setAttribute("aria-pressed", String(selected));
        element.style.borderColor = selected ? "#22d3ee" : "#f8fafc";
        element.style.transform = selected ? "scale(1.2)" : "scale(1)";
      });
    };
    if (map.isStyleLoaded()) update();
    else map.once("idle", update);
    return () => { map.off("idle", update); };
  }, [fixture, mapLoaded, selectedId]);

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
      {!mapLoaded && !mapError && <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-main/75 text-xs text-content-secondary">Loading map style and illustrative result layers…</div>}
      {mapError && <div role="alert" className="absolute inset-x-3 top-3 z-10 rounded border border-status-danger/40 bg-surface-panel/95 p-3 text-xs text-status-danger">Map initialization or rendering error: {mapError}. You can still review the illustrative result records and charts below.</div>}
    </div>
  );
};

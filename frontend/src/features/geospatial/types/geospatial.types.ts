/**
 * GeoAstra Geospatial Studio Types
 * Comprehensive type definitions for MapLibre GL, OpenFreeMap, Terra Draw, Turf.js,
 * AOIs, Scene Footprints, Basemaps, Layers, and Geocoding.
 */

import { Feature, Polygon, MultiPolygon } from "geojson";

export type BasemapId = "liberty" | "dark" | "positron" | "bright";

export interface BasemapConfig {
  id: BasemapId;
  name: string;
  attribution: string;
  styleUrl: string;
  previewColor: string;
  description: string;
}

export type DrawingMode = "idle" | "drawing" | "editing";

export interface AOIProperties {
  id: string;
  name: string;
  description?: string;
  location?: string;
  color: string;
  areaKm2: number;
  perimeterKm: number;
  crs: string;
  createdAt: string;
  updatedAt: string;
  centroid: [number, number]; // [lng, lat]
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  activeSceneName?: string;
}

export type AOIFeature = Feature<Polygon | MultiPolygon, AOIProperties>;

export interface SceneProperties {
  id: string;
  name: string;
  satellite: string;
  platform: "Spaceborne" | "Airborne";
  acquisitionDate: string;
  bandsCount: number;
  spectralRange: string;
  spatialResolution: string;
  cloudCover: number;
  status: "Calibrated" | "Available" | "Processing";
  isBenchmark: boolean;
  crs: string;
  centroid: [number, number];
  bbox: [number, number, number, number];
}

export type SceneFeature = Feature<Polygon, SceneProperties>;

export interface LayerConfig {
  id: string;
  name: string;
  description: string;
  visible: boolean;
  opacity: number; // 0 to 1
  color: string;
  type: "vector" | "raster" | "overlay";
}

export interface GeocodingResult {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: "place" | "coordinate" | "benchmark";
  bbox?: [number, number, number, number];
}

export interface MapViewState {
  lng: number;
  lat: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

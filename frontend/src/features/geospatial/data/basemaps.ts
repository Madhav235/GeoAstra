/**
 * Public Basemap Configurations
 * Public tile servers requiring zero proprietary API keys with proper attribution.
 */

import { BasemapConfig, BasemapId } from "../types/geospatial.types";

export const BASEMAPS: Record<BasemapId, BasemapConfig> = {
  dark: {
    id: "dark",
    name: "Dark Matter",
    attribution: "© OpenStreetMap contributors, © CARTO",
    tiles: [
      "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
    ],
    maxZoom: 19,
    previewColor: "#0F172A",
  },
  streets: {
    id: "streets",
    name: "OpenStreetMap",
    attribution: "© OpenStreetMap contributors",
    tiles: [
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    ],
    maxZoom: 19,
    previewColor: "#475569",
  },
  satellite: {
    id: "satellite",
    name: "World Imagery",
    attribution: "Esri, Maxar, Earthstar Geographics, CNES/Airbus DS",
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ],
    maxZoom: 18,
    previewColor: "#1E3A8A",
  },
  terrain: {
    id: "terrain",
    name: "OpenTopoMap",
    attribution: "© OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap",
    tiles: [
      "https://a.tile.opentopomap.org/{z}/{x}/{y}.png",
      "https://b.tile.opentopomap.org/{z}/{x}/{y}.png",
      "https://c.tile.opentopomap.org/{z}/{x}/{y}.png",
    ],
    maxZoom: 17,
    previewColor: "#065F46",
  },
};


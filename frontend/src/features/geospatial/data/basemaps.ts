/**
 * OpenFreeMap Basemap Configurations
 * Official OpenFreeMap vector styles requiring zero API keys, no tokens, and no registration.
 * Correct OpenFreeMap & OpenStreetMap attribution included.
 */

import { BasemapConfig, BasemapId } from "../types/geospatial.types";

export const OPENFREEMAP_ATTRIBUTION =
  '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors';

export const BASEMAPS: Record<BasemapId, BasemapConfig> = {
  liberty: {
    id: "liberty",
    name: "OpenFreeMap Liberty",
    styleUrl: "https://tiles.openfreemap.org/styles/liberty",
    attribution: OPENFREEMAP_ATTRIBUTION,
    previewColor: "#38BDF8",
    description: "Official OpenFreeMap vector cartography with terrain contours",
  },
  dark: {
    id: "dark",
    name: "OpenFreeMap Dark",
    styleUrl: "https://tiles.openfreemap.org/styles/dark",
    attribution: OPENFREEMAP_ATTRIBUTION,
    previewColor: "#0F172A",
    description: "Official OpenFreeMap dark scientific workstation cartography",
  },
  positron: {
    id: "positron",
    name: "OpenFreeMap Positron",
    styleUrl: "https://tiles.openfreemap.org/styles/positron",
    attribution: OPENFREEMAP_ATTRIBUTION,
    previewColor: "#E2E8F0",
    description: "Minimalist light vector basemap",
  },
  bright: {
    id: "bright",
    name: "OpenFreeMap Bright",
    styleUrl: "https://tiles.openfreemap.org/styles/bright",
    attribution: OPENFREEMAP_ATTRIBUTION,
    previewColor: "#0284C7",
    description: "High-contrast colorful navigation style",
  },
};

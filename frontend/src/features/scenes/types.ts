import { SceneFeature } from "../geospatial/types/geospatial.types";

export type SceneAvailability = "Available" | "Calibrated" | "Processing" | "Demo Upload";

export interface SceneCatalogItem {
  id: string;
  name: string;
  datasetId: string;
  sensor: string;
  sensorType: "Airborne" | "Spaceborne" | "Unknown";
  provider: string;
  acquisitionDate: string | null;
  location: string;
  coordinates: [number, number] | null;
  crs: string | null;
  spatialResolutionM: number | null;
  spectralBands: number | null;
  wavelengthRangeNm: [number, number] | null;
  badBandRanges?: Array<[number, number]>;
  badBandIndices?: number[];
  dataFormat: string | null;
  groundTruthAvailable: boolean | null;
  groundTruthClasses: string[];
  dimensions: [number, number] | null;
  dataSizeBytes: number | null;
  availability: SceneAvailability;
  cloudCoverPercent: number | null;
  tags: string[];
  description: string;
  source: string;
  metadataNote: string;
  footprint: SceneFeature | null;
  isSample: boolean;
}

export interface SceneFilters {
  sensors: string[];
  providers: string[];
  startDate: string;
  endDate: string;
  groundTruth: "all" | "available" | "unavailable";
  minResolution: string;
  maxResolution: string;
  availability: string;
}

export type SceneSortField = "name" | "acquisitionDate" | "spatialResolutionM" | "spectralBands";
export type SortDirection = "asc" | "desc";

export const EMPTY_SCENE_FILTERS: SceneFilters = {
  sensors: [],
  providers: [],
  startDate: "",
  endDate: "",
  groundTruth: "all",
  minResolution: "",
  maxResolution: "",
  availability: "all",
};

/**
 * Initial Seed Areas of Interest (GeoJSON Polygons)
 * Geographically accurate polygons consistent with Dashboard and Scene footprints.
 */

import { AOIFeature } from "../types/geospatial.types";

export const INITIAL_MOCK_AOIS: AOIFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-102.14, 31.93],
          [-102.06, 31.93],
          [-102.05, 32.0],
          [-102.13, 32.01],
          [-102.14, 31.93],
        ],
      ],
    },
    properties: {
      id: "aoi-permian",
      name: "Permian Basin Delaware Sector 4",
      description: "Active methane plume monitoring sector across Delaware Basin production sites.",
      location: "Reeves County, Texas, USA",
      color: "#F59E0B", // amber
      areaKm2: 142.5,
      perimeterKm: 48.2,
      crs: "EPSG:32613 (UTM 13N)",
      createdAt: "2024-03-01T10:00:00Z",
      updatedAt: "2024-03-14T15:30:00Z",
      centroid: [-102.095, 31.968],
      bbox: [-102.14, 31.93, -102.05, 32.01],
      activeSceneName: "AVIRIS_NG_PERMIAN_2024_03A",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-68.34, -23.58],
          [-68.16, -23.58],
          [-68.14, -23.42],
          [-68.32, -23.41],
          [-68.34, -23.58],
        ],
      ],
    },
    properties: {
      id: "aoi-atacama",
      name: "Salar de Atacama Lithium Complex",
      description: "Brine evaporation pond monitoring and halite-evaporite mineral abundance assessment.",
      location: "Antofagasta Region, Chile",
      color: "#38BDF8", // sky
      areaKm2: 380.2,
      perimeterKm: 78.4,
      crs: "EPSG:32719 (UTM 19S)",
      createdAt: "2024-01-10T08:15:00Z",
      updatedAt: "2024-01-20T11:45:00Z",
      centroid: [-68.24, -23.5],
      bbox: [-68.34, -23.58, -68.14, -23.41],
      activeSceneName: "ENMAP_SALAR_ATACAMA_04",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-90.02, 28.78],
          [-89.88, 28.78],
          [-89.86, 28.92],
          [-90.0, 28.93],
          [-90.02, 28.78],
        ],
      ],
    },
    properties: {
      id: "aoi-gulf-coast",
      name: "Gulf Coast Deepwater Terminal 12",
      description: "Offshore hydrocarbon seep detection and coastal sediment spectral profiling.",
      location: "Offshore Louisiana, USA",
      color: "#10B981", // emerald
      areaKm2: 85.0,
      perimeterKm: 37.6,
      crs: "EPSG:32615 (UTM 15N)",
      createdAt: "2024-02-15T14:20:00Z",
      updatedAt: "2024-03-01T09:10:00Z",
      centroid: [-89.94, 28.855],
      bbox: [-90.02, 28.78, -89.86, 28.93],
      activeSceneName: "PRISMA_GULF_COAST_L2D_901",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [5.46, 23.21],
          [5.6, 23.21],
          [5.59, 23.35],
          [5.45, 23.34],
          [5.46, 23.21],
        ],
      ],
    },
    properties: {
      id: "aoi-hoggar",
      name: "Hoggar Hydrothermal Alteration Zone",
      description: "High-temperature hydrothermal alteration zone mineral mapping using SWIR bands.",
      location: "Tamanrasset, Algeria",
      color: "#EC4899", // pink
      areaKm2: 520.8,
      perimeterKm: 94.2,
      crs: "EPSG:32631 (UTM 31N)",
      createdAt: "2024-02-20T16:00:00Z",
      updatedAt: "2024-03-03T18:20:00Z",
      centroid: [5.525, 23.275],
      bbox: [5.45, 23.21, 5.6, 23.35],
      activeSceneName: "EMIT_L2A_ALGERIA_MINERAL_22",
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-87.03, 40.47],
          [-86.98, 40.47],
          [-86.98, 40.5],
          [-87.03, 40.5],
          [-87.03, 40.47],
        ],
      ],
    },
    properties: {
      id: "aoi-indian-pines",
      name: "Indian Pines Agricultural Test Site",
      description: "Classic AVIRIS benchmark site for crop species and soil type spectral classification.",
      location: "Northwestern Indiana, USA",
      color: "#8B5CF6", // purple
      areaKm2: 24.6,
      perimeterKm: 20.1,
      crs: "EPSG:32616 (UTM 16N)",
      createdAt: "2023-06-01T09:00:00Z",
      updatedAt: "2023-06-15T12:00:00Z",
      centroid: [-87.005, 40.485],
      bbox: [-87.03, 40.47, -86.98, 40.5],
      activeSceneName: "INDIAN_PINES_AVIRIS_BENCHMARK",
    },
  },
];


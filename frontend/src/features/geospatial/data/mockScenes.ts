/**
 * Benchmark & Curated Satellite Scene Footprints (GeoJSON Polygons)
 * Geographically accurate coordinates matching real-world hyperspectral benchmarks.
 */

import { SceneFeature } from "../types/geospatial.types";

export const BENCHMARK_SCENES: SceneFeature[] = [
  {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-102.16, 31.91],
          [-102.04, 31.91],
          [-102.04, 32.02],
          [-102.16, 32.02],
          [-102.16, 31.91],
        ],
      ],
    },
    properties: {
      id: "scene-aviris-permian",
      name: "AVIRIS_NG_PERMIAN_2024_03A",
      satellite: "NASA AVIRIS-NG",
      platform: "Airborne",
      acquisitionDate: "2024-03-14",
      bandsCount: 425,
      spectralRange: "380 – 2510 nm",
      spatialResolution: "3.8m GSD",
      cloudCover: 0.2,
      status: "Calibrated",
      isBenchmark: false,
      crs: "EPSG:32613 (UTM 13N)",
      centroid: [-102.1, 31.965],
      bbox: [-102.16, 31.91, -102.04, 32.02],
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-87.035, 40.46],
          [-86.975, 40.46],
          [-86.975, 40.51],
          [-87.035, 40.51],
          [-87.035, 40.46],
        ],
      ],
    },
    properties: {
      id: "scene-indian-pines",
      name: "INDIAN_PINES_AVIRIS_BENCHMARK",
      satellite: "NASA AVIRIS Classic",
      platform: "Airborne",
      acquisitionDate: "2023-06-12",
      bandsCount: 224,
      spectralRange: "400 – 2500 nm",
      spatialResolution: "20.0m GSD",
      cloudCover: 0.0,
      status: "Available",
      isBenchmark: true,
      crs: "EPSG:32616 (UTM 16N)",
      centroid: [-87.005, 40.485],
      bbox: [-87.035, 40.46, -86.975, 40.51],
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [9.125, 45.195],
          [9.145, 45.195],
          [9.145, 45.207],
          [9.125, 45.207],
          [9.125, 45.195],
        ],
      ],
    },
    properties: {
      id: "scene-pavia-university",
      name: "PAVIA_UNIVERSITY_ROSIS_01",
      satellite: "ROSIS-03 Sensor",
      platform: "Airborne",
      acquisitionDate: "2023-07-08",
      bandsCount: 103,
      spectralRange: "430 – 860 nm",
      spatialResolution: "1.3m GSD",
      cloudCover: 0.0,
      status: "Available",
      isBenchmark: true,
      crs: "EPSG:32632 (UTM 32N)",
      centroid: [9.135, 45.201],
      bbox: [9.125, 45.195, 9.145, 45.207],
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [5.43, 23.18],
          [5.63, 23.18],
          [5.63, 23.38],
          [5.43, 23.38],
          [5.43, 23.18],
        ],
      ],
    },
    properties: {
      id: "scene-emit-algeria",
      name: "EMIT_L2A_ALGERIA_MINERAL_22",
      satellite: "NASA EMIT (ISS)",
      platform: "Spaceborne",
      acquisitionDate: "2024-03-02",
      bandsCount: 285,
      spectralRange: "381 – 2493 nm",
      spatialResolution: "60.0m GSD",
      cloudCover: 1.1,
      status: "Calibrated",
      isBenchmark: true,
      crs: "EPSG:32631 (UTM 31N)",
      centroid: [5.53, 23.28],
      bbox: [5.43, 23.18, 5.63, 23.38],
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-68.38, -23.62],
          [-68.12, -23.62],
          [-68.12, -23.38],
          [-68.38, -23.38],
          [-68.38, -23.62],
        ],
      ],
    },
    properties: {
      id: "scene-enmap-atacama",
      name: "ENMAP_SALAR_ATACAMA_04",
      satellite: "DLR EnMAP",
      platform: "Spaceborne",
      acquisitionDate: "2024-01-19",
      bandsCount: 242,
      spectralRange: "420 – 2450 nm",
      spatialResolution: "30.0m GSD",
      cloudCover: 0.0,
      status: "Calibrated",
      isBenchmark: false,
      crs: "EPSG:32719 (UTM 19S)",
      centroid: [-68.25, -23.5],
      bbox: [-68.38, -23.62, -68.12, -23.38],
    },
  },
  {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-90.06, 28.74],
          [-89.84, 28.74],
          [-89.84, 28.96],
          [-90.06, 28.96],
          [-90.06, 28.74],
        ],
      ],
    },
    properties: {
      id: "scene-prisma-gulf",
      name: "PRISMA_GULF_COAST_L2D_901",
      satellite: "ASI PRISMA",
      platform: "Spaceborne",
      acquisitionDate: "2024-02-28",
      bandsCount: 239,
      spectralRange: "400 – 2500 nm",
      spatialResolution: "30.0m GSD",
      cloudCover: 3.4,
      status: "Available",
      isBenchmark: false,
      crs: "EPSG:32615 (UTM 15N)",
      centroid: [-89.95, 28.85],
      bbox: [-90.06, 28.74, -89.84, 28.96],
    },
  },
];


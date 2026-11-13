/**
 * GeoAstra Centralized Dashboard Mock Data
 *
 * Single source of truth for workspace telemetry, scenes, AOIs, analyses,
 * detection trends, and system status simulation.
 */

import {
  DashboardScene,
  DashboardAOI,
  DashboardAnalysis,
  SystemServiceNode,
  AlgorithmDistribution,
  DailyDetectionData,
  DashboardData,
} from "../types/dashboard.types";

/**
 * Benchmark & Curated Satellite / Airborne Scenes
 */
export const MOCK_SCENES: DashboardScene[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
    id: "scene-emit-algeria",
    name: "EMIT_L2A_ALGERIA_MINERAL_22",
    satellite: "NASA EMIT (ISS)",
    platform: "Spaceborne",
    acquisitionDate: "2024-04-02",
    bandsCount: 285,
    spectralRange: "381 – 2493 nm",
    spatialResolution: "60.0m GSD",
    cloudCover: 1.1,
    status: "Calibrated",
    isBenchmark: true,
  },
  {
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
  },
  {
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
  },
];

/**
 * Areas of Interest (AOIs)
 */
export const MOCK_AOIS: DashboardAOI[] = [
  {
    id: "aoi-permian",
    name: "Permian Basin Delaware Sector 4",
    location: "Reeves County, Texas, USA",
    areaKm2: 142.5,
    crs: "EPSG:32613 (UTM 13N)",
    lastModified: "2024-03-14",
    activeSceneName: "AVIRIS_NG_PERMIAN_2024_03A",
  },
  {
    id: "aoi-atacama",
    name: "Salar de Atacama Lithium Complex",
    location: "Antofagasta Region, Chile",
    areaKm2: 380.2,
    crs: "EPSG:32719 (UTM 19S)",
    lastModified: "2024-01-20",
    activeSceneName: "ENMAP_SALAR_ATACAMA_04",
  },
  {
    id: "aoi-gulf-coast",
    name: "Gulf Coast Deepwater Terminal 12",
    location: "Offshore Louisiana, USA",
    areaKm2: 85.0,
    crs: "EPSG:32615 (UTM 15N)",
    lastModified: "2024-03-01",
    activeSceneName: "PRISMA_GULF_COAST_L2D_901",
  },
  {
    id: "aoi-hoggar",
    name: "Hoggar Hydrothermal Alteration Zone",
    location: "Tamanrasset, Algeria",
    areaKm2: 520.8,
    crs: "EPSG:32631 (UTM 31N)",
    lastModified: "2024-04-03",
    activeSceneName: "EMIT_L2A_ALGERIA_MINERAL_22",
  },
  {
    id: "aoi-indian-pines",
    name: "Indian Pines Agricultural Test Site",
    location: "Northwestern Indiana, USA",
    areaKm2: 24.6,
    crs: "EPSG:32616 (UTM 16N)",
    lastModified: "2023-06-15",
    activeSceneName: "INDIAN_PINES_AVIRIS_BENCHMARK",
  },
];

/**
 * Recent Analyses with distinct statuses
 */
export const MOCK_ANALYSES: DashboardAnalysis[] = [
  {
    id: "an-01",
    name: "Permian Point-Source Methane Plume Pinpointing",
    aoiId: "aoi-permian",
    aoiName: "Permian Basin Delaware Sector 4",
    sceneId: "scene-aviris-permian",
    sceneName: "AVIRIS_NG_PERMIAN_2024_03A",
    algorithm: "CEM",
    algorithmFullName: "Constrained Energy Minimization",
    status: "completed",
    progress: 100,
    createdAt: "28 mins ago",
    executionTime: "1m 18s",
    confidenceScore: 0.964,
    detectionsCount: 18,
  },
  {
    id: "an-02",
    name: "Atacama Lithium Brine & Evaporite Abundance",
    aoiId: "aoi-atacama",
    aoiName: "Salar de Atacama Lithium Complex",
    sceneId: "scene-enmap-atacama",
    sceneName: "ENMAP_SALAR_ATACAMA_04",
    algorithm: "MF",
    algorithmFullName: "Matched Filter",
    status: "completed",
    progress: 100,
    createdAt: "3 hours ago",
    executionTime: "2m 04s",
    confidenceScore: 0.928,
    detectionsCount: 26,
  },
  {
    id: "an-03",
    name: "Gulf Marine Petroleum Sheen Anomaly Survey",
    aoiId: "aoi-gulf-coast",
    aoiName: "Gulf Coast Deepwater Terminal 12",
    sceneId: "scene-prisma-gulf",
    sceneName: "PRISMA_GULF_COAST_L2D_901",
    algorithm: "RXD",
    algorithmFullName: "Reed-Xiaoli Anomaly Detector",
    status: "running",
    progress: 68,
    createdAt: "12 mins ago",
    executionTime: "48s elapsed",
  },
  {
    id: "an-04",
    name: "Pavia Urban Alteration Classification",
    aoiId: "aoi-indian-pines",
    aoiName: "Pavia Central Campus",
    sceneId: "scene-pavia-university",
    sceneName: "PAVIA_UNIVERSITY_ROSIS_01",
    algorithm: "Fusion",
    algorithmFullName: "Spectral-Spatial Score Fusion",
    status: "queued",
    progress: 0,
    createdAt: "Just now",
  },
  {
    id: "an-05",
    name: "Hoggar Hydrothermal Mineral Survey (Bands 150-280)",
    aoiId: "aoi-hoggar",
    aoiName: "Hoggar Hydrothermal Alteration Zone",
    sceneId: "scene-emit-algeria",
    sceneName: "EMIT_L2A_ALGERIA_MINERAL_22",
    algorithm: "CEM",
    algorithmFullName: "Constrained Energy Minimization",
    status: "failed",
    progress: 35,
    createdAt: "Yesterday",
    executionTime: "18s (OOM GPU worker)",
  },
];

/**
 * 4 Supported Algorithms Distribution
 */
export const MOCK_ALGORITHM_DISTRIBUTION: AlgorithmDistribution[] = [
  {
    id: "CEM",
    name: "CEM",
    fullName: "Constrained Energy Minimization",
    count: 58,
    percentage: 37,
    color: "#F59E0B", // amber
  },
  {
    id: "MF",
    name: "MF",
    fullName: "Matched Filter",
    count: 44,
    percentage: 28,
    color: "#818CF8", // indigo
  },
  {
    id: "RXD",
    name: "RXD",
    fullName: "Reed-Xiaoli Anomaly Detector",
    count: 36,
    percentage: 23,
    color: "#38BDF8", // sky
  },
  {
    id: "Fusion",
    name: "Fusion",
    fullName: "Spectral-Spatial Score Fusion",
    count: 18,
    percentage: 12,
    color: "#10B981", // emerald
  },
];

/**
 * Daily Detection Activity Trend over Last 7 Days
 */
export const MOCK_DETECTION_ACTIVITY: DailyDetectionData[] = [
  { date: "2024-03-08", dayLabel: "Mar 08", detections: 12, hotspots: 2 },
  { date: "2024-03-09", dayLabel: "Mar 09", detections: 19, hotspots: 4 },
  { date: "2024-03-10", dayLabel: "Mar 10", detections: 8, hotspots: 1 },
  { date: "2024-03-11", dayLabel: "Mar 11", detections: 27, hotspots: 6 },
  { date: "2024-03-12", dayLabel: "Mar 12", detections: 34, hotspots: 7 },
  { date: "2024-03-13", dayLabel: "Mar 13", detections: 22, hotspots: 3 },
  { date: "2024-03-14", dayLabel: "Today", detections: 41, hotspots: 9 },
];

/**
 * System Service Architecture Nodes (Mock Health Simulation)
 */
export const MOCK_SYSTEM_STATUS: SystemServiceNode[] = [
  {
    id: "node-express",
    name: "Express API Gateway",
    port: 5001,
    statusLabel: "DEMO PREVIEW (OFFLINE)",
    statusType: "mock-offline",
    protocol: "HTTP/REST",
    stack: "Node.js 20, Express, Prisma",
    description: "JWT session handling and BullMQ queue dispatcher.",
  },
  {
    id: "node-fastapi",
    name: "Python AI Engine",
    port: 8000,
    statusLabel: "DEMO PREVIEW (STANDBY)",
    statusType: "mock-standby",
    protocol: "FastAPI / ASGI",
    stack: "Python 3.11, NumPy, SciPy, Rasterio",
    description: "High-dimensional tensor operations and spectral filters.",
  },
  {
    id: "node-postgres",
    name: "PostgreSQL Database",
    port: 5432,
    statusLabel: "MOCK CONFIG (READY)",
    statusType: "mock-ready",
    protocol: "TCP / PostgreSQL",
    stack: "PostgreSQL 15 + PostGIS Spatial",
    description: "Relational persistence and GeoJSON polygon indexing.",
  },
  {
    id: "node-redis",
    name: "Redis / BullMQ Queue",
    port: 6379,
    statusLabel: "MOCK CONFIG (READY)",
    statusType: "mock-ready",
    protocol: "Redis RESP",
    stack: "Redis 7-Alpine, BullMQ 5",
    description: "Asynchronous job worker coordination.",
  },
];

/**
 * Aggregate Dashboard Data
 */
export const getDashboardData = (): DashboardData => {
  const totalScenes = MOCK_SCENES.length;
  const newScenesThisWeek = 2;

  const totalAOIs = MOCK_AOIS.length;
  const newAOIsThisMonth = 3;

  const totalAnalyses = MOCK_ALGORITHM_DISTRIBUTION.reduce((acc, curr) => acc + curr.count, 0);
  const completedAnalyses = 148;
  const activeAnalyses = 2; // running + queued

  const totalDetections = MOCK_DETECTION_ACTIVITY.reduce((acc, curr) => acc + curr.detections, 0);
  const recentDetections = 41; // today

  return {
    metrics: {
      totalScenes,
      newScenesThisWeek,
      totalAOIs,
      newAOIsThisMonth,
      totalAnalyses,
      completedAnalyses,
      activeAnalyses,
      totalDetections,
      recentDetections,
    },
    recentAnalyses: MOCK_ANALYSES,
    recentAOIs: MOCK_AOIS,
    recentScenes: MOCK_SCENES,
    algorithmActivity: MOCK_ALGORITHM_DISTRIBUTION,
    detectionActivity: MOCK_DETECTION_ACTIVITY,
    systemStatus: MOCK_SYSTEM_STATUS,
  };
};


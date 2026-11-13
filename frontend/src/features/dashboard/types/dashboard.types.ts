/**
 * GeoAstra Dashboard Domain Types
 * Contracts for workspace telemetry, scenes, AOIs, analyses, detections, and service health.
 */

export type AlgorithmType = "CEM" | "MF" | "RXD" | "Fusion";
export type AnalysisStatusType = "completed" | "running" | "queued" | "failed";

export interface DashboardScene {
  id: string;
  name: string;
  satellite: string;
  platform: "Airborne" | "Spaceborne";
  acquisitionDate: string;
  bandsCount: number;
  spectralRange: string;
  spatialResolution: string;
  cloudCover: number;
  status: "Available" | "Calibrated" | "Processing";
  isBenchmark?: boolean;
}

export interface DashboardAOI {
  id: string;
  name: string;
  location: string;
  areaKm2: number;
  crs: string;
  lastModified: string;
  activeSceneName: string;
}

export interface DashboardAnalysis {
  id: string;
  name: string;
  aoiId: string;
  aoiName: string;
  sceneId: string;
  sceneName: string;
  algorithm: AlgorithmType;
  algorithmFullName: string;
  status: AnalysisStatusType;
  progress?: number;
  createdAt: string;
  executionTime?: string;
  confidenceScore?: number;
  detectionsCount?: number;
}

export interface SystemServiceNode {
  id: string;
  name: string;
  port: number;
  statusLabel: string;
  statusType: "mock-offline" | "mock-standby" | "mock-ready";
  protocol: string;
  stack: string;
  description: string;
}

export interface AlgorithmDistribution {
  id: AlgorithmType;
  name: string;
  fullName: string;
  count: number;
  percentage: number;
  color: string;
}

export interface DailyDetectionData {
  date: string;
  dayLabel: string;
  detections: number;
  hotspots: number;
}

export interface DashboardMetrics {
  totalScenes: number;
  newScenesThisWeek: number;
  totalAOIs: number;
  newAOIsThisMonth: number;
  totalAnalyses: number;
  completedAnalyses: number;
  activeAnalyses: number;
  totalDetections: number;
  recentDetections: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentAnalyses: DashboardAnalysis[];
  recentAOIs: DashboardAOI[];
  recentScenes: DashboardScene[];
  algorithmActivity: AlgorithmDistribution[];
  detectionActivity: DailyDetectionData[];
  systemStatus: SystemServiceNode[];
}


/**
 * GeoAstra API Data Contracts & Types
 * Derived from backend/prisma/schema.prisma and controller response payloads.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface GeoJsonGeometry {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
}

export interface Area {
  id: string;
  userId: string;
  name: string;
  geometry: GeoJsonGeometry;
  crs: string;
  createdAt: string;
  updatedAt: string;
}

export interface SatelliteScene {
  id: string;
  provider: string;
  sensor: string;
  externalSceneId: string;
  acquisitionTime: string;
  footprint: GeoJsonGeometry;
  productLevel: string;
  spatialResolution: number | null;
  storageKey: string | null;
  cloudOrQualityMetadata?: Record<string, any> | null;
  wavelengthMetadata?: {
    bands_count?: number;
    range_nm?: [number, number];
    [key: string]: any;
  } | null;
  metadataJson?: {
    bands_count?: number;
    spectral_range?: string;
    description?: string;
    has_ground_truth?: boolean;
    cloud_fraction?: number;
    [key: string]: any;
  } | null;
  createdAt: string;
}

export interface TargetSignature {
  id: string;
  ownerUserId: string | null;
  name: string;
  sensor: string;
  wavelengths: number[];
  values: number[];
  units: string;
  source: string;
  provenance?: string | null;
  createdAt: string;
}

export type AnalysisStatus =
  | "QUEUED"
  | "ACQUIRING_DATA"
  | "PREPROCESSING"
  | "RUNNING_ALGORITHMS"
  | "GENERATING_OUTPUTS"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type AlgorithmType = "rxd" | "matched_filter" | "cem" | "fusion";

export interface AlgorithmConfig {
  normalization?: "l2" | "standard" | "minmax";
  regularization?: number;
  pca_components?: number;
  threshold_percentile?: number;
  alpha?: number; // for score fusion
  colormap?: string;
  [key: string]: any;
}

export interface DetectionResult {
  id: string;
  analysisId: string;
  resultType: string;
  algorithm: string;
  rasterStorageKey: string | null;
  vectorStorageKey: string | null;
  previewStorageKey: string | null;
  metricsJson: {
    execution_time_ms?: number;
    input_bands?: number;
    processed_bands?: number;
    bad_bands_removed?: number;
    height?: number;
    width?: number;
    pixel_count?: number;
    detected_features_count?: number;
    algorithm_stats?: Record<string, any>;
    evaluation?: {
      auc?: number;
      target_count?: number;
      background_count?: number;
      optimal_threshold?: number;
      precision?: number;
      recall?: number;
      f1_score?: number;
      pd_at_fixed_pfa?: Record<string, number>;
      roc_curve_samples?: Array<{ pfa: number; pd: number; threshold: number }>;
    } | null;
    [key: string]: any;
  } | null;
  processingMetadata?: {
    completed_via?: string;
    worker_node?: string;
    comparative_summary?: string | null;
    [key: string]: any;
  } | null;
  createdAt: string;
}

export interface ProviderRun {
  id: string;
  analysisId: string;
  provider: string;
  model: string;
  task: string;
  status: string;
  responseJson?: { text?: string; [key: string]: any } | null;
  latencyMs?: number | null;
  usageJson?: Record<string, any> | null;
  error?: string | null;
  createdAt: string;
}

export interface Analysis {
  id: string;
  userId: string;
  areaId: string;
  sceneId: string;
  status: AnalysisStatus;
  algorithmConfiguration: AlgorithmConfig & { algorithm?: AlgorithmType };
  targetSignatureId?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
  area?: Area;
  scene?: SatelliteScene;
  targetSignature?: TargetSignature | null;
  detectionResults?: DetectionResult[];
  providerRuns?: ProviderRun[];
}

export interface ConsolidatedAnalysisResults {
  analysisId: string;
  status: AnalysisStatus;
  algorithm: string;
  startedAt?: string | null;
  completedAt?: string | null;
  scene: {
    id: string;
    sensor: string;
    productLevel: string;
  };
  detectionResults: DetectionResult[];
  providerRuns: ProviderRun[];
  metrics: Record<string, any> | null;
  artifacts: {
    previewUrl: string;
    rasterUrl: string;
    polygonsUrl: string;
  };
  aiExplanations: {
    comparativeSummary: string | null;
    providerRuns: Array<{
      provider: string;
      model: string;
      status: string;
      latencyMs?: number | null;
      response?: string | null;
      error?: string | null;
    }>;
  };
}

export interface ServicesHealth {
  status: "healthy" | "degraded";
  timestamp: string;
  services: {
    backend: {
      status: "healthy" | "unreachable" | "degraded";
      service: string;
      version: string;
    };
    aiEngine: {
      status: "healthy" | "unreachable" | "degraded";
      latencyMs?: number;
      details?: Record<string, any> | null;
      error?: any;
    };
  };
}


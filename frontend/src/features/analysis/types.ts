export type AnalysisAlgorithmId = "rxd" | "mf" | "cem" | "fusion";
export type NormalizationMethod = "none" | "min-max" | "z-score" | "l2";
export type BackgroundEstimationMethod = "global" | "local";
export type AnalysisOutputMode = "continuous" | "binary";
export type FusionStrategy = "spatial-spectral" | "target-weighted";

export interface RXDSettings {
  detectionMode: "global" | "local";
  regularization: number;
  localWindowSize: number;
}

export interface MatchedFilterSettings {
  backgroundMethod: BackgroundEstimationMethod;
  regularization: number;
  outputMode: AnalysisOutputMode;
}

export interface CEMSettings {
  backgroundMethod: BackgroundEstimationMethod;
  regularization: number;
  outputMode: AnalysisOutputMode;
}

export interface FusionSettings {
  strategy: FusionStrategy;
  spatialWeight: number;
  spectralWeight: number;
}

export type AlgorithmSettings =
  | { algorithm: "rxd"; parameters: RXDSettings }
  | { algorithm: "mf"; parameters: MatchedFilterSettings }
  | { algorithm: "cem"; parameters: CEMSettings }
  | { algorithm: "fusion"; parameters: FusionSettings };

export interface AnalysisConfiguration {
  aoiId: string | null;
  sceneId: string | null;
  algorithm: AnalysisAlgorithmId;
  targetSignatureId: string | null;
  algorithmSettings: AlgorithmSettings;
  normalization: NormalizationMethod;
  pca: {
    enabled: boolean;
    components: number;
  };
  thresholdPercentile: number;
}

export interface AnalysisJobRecord {
  id: string;
  status: "queued";
  demo: true;
  submittedAt: string;
  configuration: AnalysisConfiguration;
  aoiName: string;
  sceneName: string;
  targetSignatureName: string | null;
}

export type AnalysisValidationErrors = Partial<Record<
  | "aoi"
  | "scene"
  | "algorithm"
  | "targetSignature"
  | "parameters"
  | "normalization"
  | "pca"
  | "threshold",
  string
>>;

export const DEFAULT_RXD_SETTINGS: RXDSettings = {
  detectionMode: "global",
  regularization: 0.0001,
  localWindowSize: 15,
};

export const DEFAULT_MF_SETTINGS: MatchedFilterSettings = {
  backgroundMethod: "global",
  regularization: 0.0001,
  outputMode: "continuous",
};

export const DEFAULT_CEM_SETTINGS: CEMSettings = {
  backgroundMethod: "global",
  regularization: 0.0001,
  outputMode: "continuous",
};

export const DEFAULT_FUSION_SETTINGS: FusionSettings = {
  strategy: "spatial-spectral",
  spatialWeight: 60,
  spectralWeight: 40,
};

export const ALGORITHM_OPTIONS: {
  id: AnalysisAlgorithmId;
  acronym: string;
  name: string;
  purpose: string;
}[] = [
  {
    id: "rxd",
    acronym: "RXD",
    name: "Reed-Xiaoli Detector",
    purpose: "Unsupervised anomaly scoring against estimated background statistics.",
  },
  {
    id: "mf",
    acronym: "MF",
    name: "Matched Filter",
    purpose: "Target-guided spectral scoring using a selected reference signature.",
  },
  {
    id: "cem",
    acronym: "CEM",
    name: "Constrained Energy Minimization",
    purpose: "Target-constrained spectral scoring with background energy suppression.",
  },
  {
    id: "fusion",
    acronym: "FUSION",
    name: "Spatial-Spectral Fusion",
    purpose: "Combines spectral and spatial score components using configured weights.",
  },
];

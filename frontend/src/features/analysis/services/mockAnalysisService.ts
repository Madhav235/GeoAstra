import { useDemoAnalysisJobStore } from "@/features/jobs/store/demoAnalysisJobStore";
import {
  AnalysisConfiguration,
  AnalysisJobRecord,
  AnalysisValidationErrors,
} from "../types";

export interface AnalysisAvailability {
  aoiIds: string[];
  sceneIds: string[];
  signatureIds: string[];
  sceneBandCount: number | null;
}

export interface AnalysisJobLabels {
  aoiName: string;
  sceneName: string;
  targetSignatureName: string | null;
}

export function requiresTargetSignature(configuration: AnalysisConfiguration): boolean {
  return configuration.algorithm === "mf" ||
    configuration.algorithm === "cem" ||
    (configuration.algorithm === "fusion" && configuration.algorithmSettings.algorithm === "fusion" &&
      configuration.algorithmSettings.parameters.strategy === "target-weighted");
}

export function validateAnalysisConfiguration(
  configuration: AnalysisConfiguration,
  availability: AnalysisAvailability
): AnalysisValidationErrors {
  const errors: AnalysisValidationErrors = {};
  const settings = configuration.algorithmSettings;

  if (!configuration.aoiId || !availability.aoiIds.includes(configuration.aoiId)) {
    errors.aoi = "Select an existing saved AOI.";
  }
  if (!configuration.sceneId || !availability.sceneIds.includes(configuration.sceneId)) {
    errors.scene = "Select an existing scene from the catalogue.";
  }
  if (!["rxd", "mf", "cem", "fusion"].includes(configuration.algorithm)) {
    errors.algorithm = "Select a supported analysis algorithm.";
  }
  if (requiresTargetSignature(configuration) &&
      (!configuration.targetSignatureId || !availability.signatureIds.includes(configuration.targetSignatureId))) {
    errors.targetSignature = "Select a target signature from the Spectral Library.";
  }
  if (!["none", "min-max", "z-score", "l2"].includes(configuration.normalization)) {
    errors.normalization = "Select a supported normalization method.";
  }
  if (!Number.isFinite(configuration.thresholdPercentile) ||
      configuration.thresholdPercentile < 90 || configuration.thresholdPercentile > 99.9) {
    errors.threshold = "Threshold percentile must be between 90 and 99.9.";
  }

  if (settings.algorithm !== configuration.algorithm) {
    errors.parameters = "The selected algorithm settings do not match the selected algorithm.";
  } else if (settings.algorithm === "rxd") {
    const { detectionMode, regularization, localWindowSize } = settings.parameters;
    if (!["global", "local"].includes(detectionMode) ||
        !Number.isFinite(regularization) || regularization < 0 || regularization > 1 ||
        (detectionMode === "local" &&
          (!Number.isInteger(localWindowSize) || localWindowSize < 3 || localWindowSize > 101 || localWindowSize % 2 === 0))) {
      errors.parameters = "Check RXD mode, regularization (0–1), and the odd local window size (3–101).";
    }
  } else if (settings.algorithm === "mf" || settings.algorithm === "cem") {
    const { backgroundMethod, regularization, outputMode } = settings.parameters;
    if (!["global", "local"].includes(backgroundMethod) ||
        !Number.isFinite(regularization) || regularization < 0 || regularization > 1 ||
        !["continuous", "binary"].includes(outputMode)) {
      errors.parameters = "Check background estimation, regularization (0–1), and output mode.";
    }
  } else {
    const { strategy, spatialWeight, spectralWeight } = settings.parameters;
    if (!["spatial-spectral", "target-weighted"].includes(strategy) ||
        !Number.isFinite(spatialWeight) || !Number.isFinite(spectralWeight) ||
        spatialWeight < 0 || spectralWeight < 0 || spatialWeight + spectralWeight !== 100) {
      errors.parameters = "Fusion weights must be valid, non-negative percentages totaling 100%.";
    }
  }

  if (configuration.pca.enabled) {
    const maxComponents = availability.sceneBandCount ?? 100;
    if (!Number.isInteger(configuration.pca.components) ||
        configuration.pca.components < 1 ||
        configuration.pca.components > maxComponents) {
      errors.pca = `PCA components must be between 1 and ${maxComponents}${availability.sceneBandCount ? " (the selected scene band count)" : ""}.`;
    }
  }
  return errors;
}

function createJobId(): string {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Secure random ID generation is unavailable; the demo job was not created.");
  }
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `job-demo-${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function submitMockAnalysis(
  configuration: AnalysisConfiguration,
  availability: AnalysisAvailability,
  labels: AnalysisJobLabels
): AnalysisJobRecord {
  const errors = validateAnalysisConfiguration(configuration, availability);
  if (Object.keys(errors).length) {
    throw new Error(`Invalid demo analysis configuration: ${Object.values(errors).join(" ")}`);
  }

  const job: AnalysisJobRecord = {
    id: createJobId(),
    status: "queued",
    demo: true,
    submittedAt: new Date().toISOString(),
    configuration,
    ...labels,
  };
  useDemoAnalysisJobStore.getState().addJob(job);
  return job;
}

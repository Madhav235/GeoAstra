import { apiClient, API_BASE_URL } from "./client";
import {
  Analysis,
  ConsolidatedAnalysisResults,
  AlgorithmType,
  AlgorithmConfig,
} from "./types";

export interface CreateAnalysisPayload {
  areaId: string;
  sceneId: string;
  algorithm?: AlgorithmType | "combined";
  targetSignatureId?: string;
  runProviderComparison?: boolean;
  algorithmConfiguration?: AlgorithmConfig;
}

export const analysisApi = {
  /**
   * Dispatches a new hyperspectral processing job to BullMQ.
   * Automatically sanitizes algorithm="combined" to "fusion" to prevent Python engine crash.
   */
  async createAnalysis(payload: CreateAnalysisPayload): Promise<{
    analysisId: string;
    status: string;
    message: string;
  }> {
    const sanitizedAlgorithm =
      payload.algorithm === "combined" ? "fusion" : payload.algorithm || "rxd";

    return apiClient.post("/api/v1/analysis", {
      ...payload,
      algorithm: sanitizedAlgorithm,
    });
  },

  async listAnalyses(): Promise<{ analyses: Analysis[]; count: number }> {
    return apiClient.get("/api/v1/analysis");
  },

  async getAnalysis(analysisId: string): Promise<{ analysis: Analysis }> {
    return apiClient.get(`/api/v1/analysis/${analysisId}`);
  },

  async getResults(analysisId: string): Promise<ConsolidatedAnalysisResults> {
    return apiClient.get(`/api/v1/analysis/${analysisId}/results`);
  },

  async cancelAnalysis(analysisId: string): Promise<{ analysis: Analysis }> {
    return apiClient.post(`/api/v1/analysis/${analysisId}/cancel`);
  },

  // Direct artifact URL builders (requires Bearer token if fetched via client, or passed in headers)
  getPreviewUrl(analysisId: string): string {
    return `${API_BASE_URL}/api/v1/analysis/${analysisId}/preview`;
  },

  getRasterUrl(analysisId: string): string {
    return `${API_BASE_URL}/api/v1/analysis/${analysisId}/raster`;
  },

  getPolygonsUrl(analysisId: string): string {
    return `${API_BASE_URL}/api/v1/analysis/${analysisId}/polygons`;
  },
};


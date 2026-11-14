import { apiClient } from "./client";
import { SatelliteScene } from "./types";

export interface ListScenesParams {
  provider?: string;
  sensor?: string;
  limit?: number;
  offset?: number;
}

export interface SearchScenesParams {
  sensor?: string;
  provider?: string;
  startDate?: string;
  endDate?: string;
}

export const sceneApi = {
  async listScenes(params?: ListScenesParams): Promise<{
    total: number;
    count: number;
    scenes: SatelliteScene[];
  }> {
    return apiClient.get("/api/v1/scenes", { params });
  },

  async searchScenes(params?: SearchScenesParams): Promise<{
    query: SearchScenesParams;
    resultsCount: number;
    scenes: SatelliteScene[];
  }> {
    return apiClient.get("/api/v1/scenes/search", { params });
  },

  async getScene(sceneId: string): Promise<SatelliteScene> {
    return apiClient.get(`/api/v1/scenes/${sceneId}`);
  },
};


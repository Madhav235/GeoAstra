import { apiClient } from "./client";
import { Area, GeoJsonGeometry } from "./types";

export interface CreateAreaPayload {
  name: string;
  geometry: GeoJsonGeometry;
  crs?: string;
}

export interface UpdateAreaPayload {
  name?: string;
  geometry?: GeoJsonGeometry;
  crs?: string;
}

export const areaApi = {
  async listAreas(): Promise<{ areas: Area[]; count: number }> {
    return apiClient.get("/api/v1/areas");
  },

  async getArea(areaId: string): Promise<{ area: Area }> {
    return apiClient.get(`/api/v1/areas/${areaId}`);
  },

  async createArea(payload: CreateAreaPayload): Promise<{ area: Area }> {
    return apiClient.post("/api/v1/areas", payload);
  },

  async updateArea(areaId: string, payload: UpdateAreaPayload): Promise<{ area: Area }> {
    return apiClient.patch(`/api/v1/areas/${areaId}`, payload);
  },

  async deleteArea(areaId: string): Promise<{ id: string; deleted: boolean }> {
    return apiClient.delete(`/api/v1/areas/${areaId}`);
  },
};


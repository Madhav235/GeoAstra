import { apiClient } from "./client";
import { ServicesHealth } from "./types";

export interface BasicHealth {
  status: string;
  service: string;
  version: string;
  environment: string;
  timestamp: string;
}

export const healthApi = {
  async getHealth(): Promise<BasicHealth> {
    return apiClient.get("/health");
  },

  async getServicesHealth(): Promise<ServicesHealth> {
    return apiClient.get("/health/services");
  },
};


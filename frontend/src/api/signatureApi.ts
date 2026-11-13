import { apiClient } from "./client";
import { TargetSignature } from "./types";

export interface CreateSignaturePayload {
  name: string;
  sensor?: string;
  wavelengths: number[];
  values: number[];
  units?: string;
  source?: string;
  provenance?: string | null;
}

export const signatureApi = {
  async listSignatures(): Promise<TargetSignature[]> {
    return apiClient.get("/api/v1/signatures");
  },

  async getSignature(signatureId: string): Promise<TargetSignature> {
    return apiClient.get(`/api/v1/signatures/${signatureId}`);
  },

  async createSignature(payload: CreateSignaturePayload): Promise<TargetSignature> {
    return apiClient.post("/api/v1/signatures", payload);
  },

  async deleteSignature(signatureId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/api/v1/signatures/${signatureId}`);
  },
};


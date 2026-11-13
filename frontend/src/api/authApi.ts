import { apiClient } from "./client";
import { AuthResponse, User } from "./types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return apiClient.post("/api/v1/auth/register", payload);
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    return apiClient.post("/api/v1/auth/login", payload);
  },

  async getMe(): Promise<{ user: User }> {
    return apiClient.get("/api/v1/users/me");
  },
};


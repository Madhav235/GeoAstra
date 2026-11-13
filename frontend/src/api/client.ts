import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export const TOKEN_STORAGE_KEY = "geoastra_auth_token";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach Bearer JWT if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Normalize inconsistent backend envelopes
// Auth, Area, Analysis return: { success: true, data: ... }
// Scene, Signature return: { status: "success", data: ... }
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // If response contains an envelope wrapper with .data, unwrap it cleanly
    if (response.data && typeof response.data === "object" && "data" in response.data) {
      // Return unwrapped payload directly
      return response.data.data;
    }
    return response.data;
  },
  (error: AxiosError<any>) => {
    let message = "Network or service communication failure";
    if (error.response?.data) {
      if (typeof error.response.data === "string") {
        message = error.response.data;
      } else if (error.response.data.message) {
        message = error.response.data.message;
      } else if (error.response.data.error) {
        message = error.response.data.error;
      }
    } else if (error.message) {
      message = error.message;
    }

    // Enhance error object with formatted user-facing message
    const customError = new Error(message) as Error & {
      statusCode?: number;
      originalError?: AxiosError;
    };
    customError.statusCode = error.response?.status;
    customError.originalError = error;

    return Promise.reject(customError);
  }
);


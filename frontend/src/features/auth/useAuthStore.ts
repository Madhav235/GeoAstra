import { create } from "zustand";
import { User } from "@/api/types";
import { authApi, LoginPayload, RegisterPayload } from "@/api/authApi";
import { TOKEN_STORAGE_KEY } from "@/api/client";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  loginDemo: (role?: string) => void;
  clearError: () => void;
}

const DEMO_USER: User = {
  id: "e305e55e-efcf-4481-8077-d0d5402fb3bf",
  name: "Alex Mercer",
  email: "alex.mercer@geoastra.io",
  role: "analyst",
  createdAt: "2024-01-01T00:00:00.000Z",
};

export const useAuthStore = create<AuthState>((set) => ({
  user: DEMO_USER,
  token: localStorage.getItem(TOKEN_STORAGE_KEY) || "demo_session_token_analyst",
  isAuthenticated: true,
  isLoading: false,
  error: null,

  initialize: async () => {
    const existingToken = localStorage.getItem(TOKEN_STORAGE_KEY) || "demo_session_token_analyst";
    localStorage.setItem(TOKEN_STORAGE_KEY, existingToken);

    if (existingToken.startsWith("demo_session_token_")) {
      set({
        user: DEMO_USER,
        token: existingToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return;
    }

    try {
      set({ isLoading: true });
      const res = await authApi.getMe();
      set({
        user: res.user,
        token: existingToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch {
      // Fallback to demo user
      set({
        user: DEMO_USER,
        token: existingToken,
        isAuthenticated: true,
        isLoading: false,
      });
    }
  },

  login: async (payload: LoginPayload) => {
    try {
      set({ isLoading: true, error: null });
      const res = await authApi.login(payload);
      localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
      set({
        user: res.user,
        token: res.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to sign in. Please verify credentials.",
      });
      throw err;
    }
  },

  register: async (payload: RegisterPayload) => {
    try {
      set({ isLoading: true, error: null });
      const res = await authApi.register(payload);
      localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
      set({
        user: res.user,
        token: res.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Registration failed. Please check information.",
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  loginDemo: (_role = "Senior Analyst") => {
    const demoToken = `demo_session_token_${Date.now()}`;
    localStorage.setItem(TOKEN_STORAGE_KEY, demoToken);
    set({
      user: {
        id: "e305e55e-efcf-4481-8077-d0d5402fb3bf",
        name: "Alex Mercer",
        email: "alex.mercer@geoastra.io",
        createdAt: new Date().toISOString(),
      },
      token: demoToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));

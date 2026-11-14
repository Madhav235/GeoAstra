import { create } from "zustand";
import {
  AuthUser,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
} from "./types/auth.types";
import { mockAuthService } from "./services/mockAuthService";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  session: null,
  isAuthenticated: false,
  isLoading: true, // Start in loading state while checking session
  isSubmitting: false,
  error: null,
  rememberMe: true,

  restoreSession: async (): Promise<boolean> => {
    try {
      set({ isLoading: true });
      const session = await mockAuthService.restoreSession();
      if (session) {
        set({
          user: session.user,
          token: session.token,
          session,
          isAuthenticated: true,
          rememberMe: session.rememberMe,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          user: null,
          token: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return false;
      }
    } catch {
      set({
        user: null,
        token: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
  },

  login: async (credentials: LoginCredentials): Promise<AuthUser> => {
    try {
      set({ isSubmitting: true, error: null });
      const session = await mockAuthService.login(credentials);
      set({
        user: session.user,
        token: session.token,
        session,
        isAuthenticated: true,
        rememberMe: session.rememberMe,
        isSubmitting: false,
        error: null,
      });
      return session.user;
    } catch (err: any) {
      set({
        isSubmitting: false,
        error: err.message || "Failed to sign in. Please verify credentials.",
      });
      throw err;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthUser> => {
    try {
      set({ isSubmitting: true, error: null });
      const session = await mockAuthService.register(credentials);
      set({
        user: session.user,
        token: session.token,
        session,
        isAuthenticated: true,
        rememberMe: session.rememberMe,
        isSubmitting: false,
        error: null,
      });
      return session.user;
    } catch (err: any) {
      set({
        isSubmitting: false,
        error: err.message || "Failed to create account.",
      });
      throw err;
    }
  },

  logout: async (): Promise<void> => {
    try {
      set({ isSubmitting: true });
      await mockAuthService.logout();
    } finally {
      set({
        user: null,
        token: null,
        session: null,
        isAuthenticated: false,
        isSubmitting: false,
        error: null,
      });
    }
  },

  initialize: async () => {
    const restore = useAuthStore.getState().restoreSession;
    await restore();
  },

  clearError: () => set({ error: null }),
}));

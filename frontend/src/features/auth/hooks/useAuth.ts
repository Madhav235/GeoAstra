import { useAuthStore } from "../useAuthStore";

/**
 * Custom hook to access authentication state and operations.
 */
export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const session = useAuthStore((s) => s.session);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isSubmitting = useAuthStore((s) => s.isSubmitting);
  const error = useAuthStore((s) => s.error);
  const rememberMe = useAuthStore((s) => s.rememberMe);

  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const clearError = useAuthStore((s) => s.clearError);

  return {
    user,
    token,
    session,
    isAuthenticated,
    isLoading,
    isSubmitting,
    error,
    rememberMe,
    login,
    register,
    logout,
    restoreSession,
    clearError,
  };
};


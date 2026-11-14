/**
 * GeoAstra Authentication Domain Types
 * Defines contracts for mock and production client-side authentication.
 */

export type UserRole = "Senior Analyst" | "Analyst" | "Remote Sensing Specialist" | "Administrator";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  organization?: string;
  clearance?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  acceptTerms: boolean;
  role?: UserRole | string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  rememberMe: boolean;
  issuedAt: string;
  expiresAt: string;
}

export interface AuthValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  rememberMe: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  register: (credentials: RegisterCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
  initialize: () => Promise<boolean | void>;
  clearError: () => void;
}

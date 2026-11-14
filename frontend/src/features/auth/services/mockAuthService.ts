/**
 * GeoAstra Mock Authentication Service
 *
 * NOTE: This is a client-side session simulation for demonstration and UI development.
 * It does NOT connect to the backend and is NOT suitable for production security.
 * Passwords are never stored in browser storage.
 */

import {
  AuthUser,
  AuthSession,
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth.types";

export const SESSION_STORAGE_KEY = "geoastra_auth_session";
export const USERS_DB_STORAGE_KEY = "geoastra_mock_users_db";

interface StoredUserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  clearance: string;
  passwordHash: string; // Simulated hashed password representation
  createdAt: string;
}

/**
 * Default demonstration account specified in project requirements:
 * Email: analyst@geoastra.demo
 * Password: GeoAstra@123
 * User: Alex Mercer, Senior Analyst
 */
const DEFAULT_DEMO_USER: StoredUserRecord = {
  id: "e305e55e-efcf-4481-8077-d0d5402fb3bf",
  name: "Alex Mercer",
  email: "analyst@geoastra.demo",
  role: "Senior Analyst",
  organization: "GeoAstra Intelligence Directorate",
  clearance: "TS / HYPERSPECTRAL SCI",
  // Simple simulation of hashed password for client-side comparison
  passwordHash: "GeoAstra@123",
  createdAt: "2024-01-01T00:00:00.000Z",
};

/**
 * Simulates a realistic network/cryptographic latency
 */
const delay = (ms = 450): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates a mock JWT token format
 */
const generateMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iss: "geoastra-mock-auth",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 7,
    })
  );
  const sig = Math.random().toString(36).substring(2, 15);
  return `${header}.${payload}.${sig}`;
};

class MockAuthService {
  /**
   * Retrieves the mock users database from localStorage, initializing with the default demo account
   */
  private getUsersDb(): StoredUserRecord[] {
    try {
      const raw = localStorage.getItem(USERS_DB_STORAGE_KEY);
      if (!raw) {
        const initial = [DEFAULT_DEMO_USER];
        localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      const parsed = JSON.parse(raw);
      // Ensure default demo account is always present
      if (!parsed.some((u: StoredUserRecord) => u.email.toLowerCase() === DEFAULT_DEMO_USER.email.toLowerCase())) {
        parsed.unshift(DEFAULT_DEMO_USER);
        localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return [DEFAULT_DEMO_USER];
    }
  }

  /**
   * Saves updated users database
   */
  private saveUsersDb(users: StoredUserRecord[]): void {
    try {
      localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(users));
    } catch {
      // Ignore storage quota errors in demo mode
    }
  }

  /**
   * Authenticate with email & password
   */
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    await delay(500);

    const emailClean = credentials.email.trim().toLowerCase();
    const users = this.getUsersDb();

    const userRecord = users.find(
      (u) => u.email.toLowerCase() === emailClean
    );

    if (!userRecord || userRecord.passwordHash !== credentials.password) {
      throw new Error("Invalid email or password. Please verify your credentials.");
    }

    const authUser: AuthUser = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      role: userRecord.role,
      organization: userRecord.organization,
      clearance: userRecord.clearance,
      createdAt: userRecord.createdAt,
      lastLoginAt: new Date().toISOString(),
    };

    const rememberMe = Boolean(credentials.rememberMe);
    const session: AuthSession = {
      token: generateMockToken(authUser.id),
      user: authUser,
      rememberMe,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400 * 1000 * (rememberMe ? 14 : 1)).toISOString(),
    };

    // Store session according to Remember Me preference
    this.storeSession(session, rememberMe);

    return session;
  }

  /**
   * Register a new user account
   */
  async register(credentials: RegisterCredentials): Promise<AuthSession> {
    await delay(600);

    const emailClean = credentials.email.trim().toLowerCase();
    const nameClean = credentials.name.trim();

    if (!credentials.acceptTerms) {
      throw new Error("You must accept the terms and conditions to register.");
    }

    if (credentials.password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    if (credentials.confirmPassword && credentials.password !== credentials.confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    const users = this.getUsersDb();

    // Check for existing user with this email
    if (users.some((u) => u.email.toLowerCase() === emailClean)) {
      throw new Error("An analyst account with this email address already exists.");
    }

    const newUserRecord: StoredUserRecord = {
      id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      name: nameClean,
      email: credentials.email.trim(),
      role: credentials.role || "Analyst",
      organization: "GeoAstra Intelligence Directorate",
      clearance: "SECRET / HYPERSPECTRAL",
      passwordHash: credentials.password, // Simulated client-side hash
      createdAt: new Date().toISOString(),
    };

    users.push(newUserRecord);
    this.saveUsersDb(users);

    const authUser: AuthUser = {
      id: newUserRecord.id,
      name: newUserRecord.name,
      email: newUserRecord.email,
      role: newUserRecord.role,
      organization: newUserRecord.organization,
      clearance: newUserRecord.clearance,
      createdAt: newUserRecord.createdAt,
      lastLoginAt: new Date().toISOString(),
    };

    // Default rememberMe to true for new registrations
    const session: AuthSession = {
      token: generateMockToken(authUser.id),
      user: authUser,
      rememberMe: true,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400 * 1000 * 14).toISOString(),
    };

    this.storeSession(session, true);

    return session;
  }

  /**
   * Logs out the user and clears all session storage
   */
  async logout(): Promise<void> {
    await delay(250);
    this.clearAllSessions();
  }

  /**
   * Stores session in either localStorage or sessionStorage
   * Clears the other storage mechanism to prevent conflicting state
   */
  private storeSession(session: AuthSession, rememberMe: boolean): void {
    const serialized = JSON.stringify(session);
    if (rememberMe) {
      localStorage.setItem(SESSION_STORAGE_KEY, serialized);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } else {
      sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  /**
   * Clears session from both localStorage and sessionStorage
   */
  clearAllSessions(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }

  /**
   * Restores an existing session from localStorage (Remembered) or sessionStorage (Current window)
   */
  async restoreSession(): Promise<AuthSession | null> {
    // Check localStorage first (remembered session)
    const localRaw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (localRaw) {
      try {
        const session: AuthSession = JSON.parse(localRaw);
        if (session && session.user && session.token) {
          return session;
        }
      } catch {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }

    // Check sessionStorage (temporary browser session)
    const sessionRaw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (sessionRaw) {
      try {
        const session: AuthSession = JSON.parse(sessionRaw);
        if (session && session.user && session.token) {
          return session;
        }
      } catch {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }

    return null;
  }

  /**
   * Synchronously checks if a session token exists in either storage
   */
  checkAuthStatus(): boolean {
    return Boolean(
      localStorage.getItem(SESSION_STORAGE_KEY) ||
        sessionStorage.getItem(SESSION_STORAGE_KEY)
    );
  }

  /**
   * Synchronously reads current user if available
   */
  getCurrentUser(): AuthUser | null {
    try {
      const raw =
        localStorage.getItem(SESSION_STORAGE_KEY) ||
        sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);
      return session.user || null;
    } catch {
      return null;
    }
  }
}

export const mockAuthService = new MockAuthService();


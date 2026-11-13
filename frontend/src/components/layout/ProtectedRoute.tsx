import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Spinner } from "@/components/feedback/Spinner";

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-surface-main bg-tech-grid">
        <div className="flex flex-col items-center gap-3.5 p-6 rounded-xl bg-surface-panel/80 border border-border-subtle shadow-xl backdrop-blur-md">
          <Spinner size="lg" variant="primary" />
          <div className="text-center space-y-1">
            <span className="font-mono text-xs text-content-primary font-semibold tracking-wider block">
              SYNCHRONIZING WORKSTATION SESSION
            </span>
            <span className="font-mono text-2xs text-content-muted">
              Verifying client session persistence &amp; access credentials...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to /login, storing current location to restore after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};


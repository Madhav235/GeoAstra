import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";
import { Spinner } from "@/components/feedback/Spinner";

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-surface-main">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" variant="primary" />
          <span className="font-mono text-xs text-content-muted tracking-wider">
            SYNCHRONIZING WORKSTATION SESSION...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};


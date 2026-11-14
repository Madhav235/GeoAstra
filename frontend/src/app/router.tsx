import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { WorkspacePage } from "@/features/workspace/WorkspacePage";
import { SceneExplorerPage } from "@/features/scenes/SceneExplorerPage";
import { SpectralLibraryPage } from "@/features/signatures/SpectralLibraryPage";
import { AnalysisStudioPage } from "@/features/analysis/AnalysisStudioPage";
import { JobsPage } from "@/features/jobs/JobsPage";
import { JobDetailPage } from "@/features/jobs/JobDetailPage";
import { ResultsExplorerPage } from "@/features/results/ResultsExplorerPage";
import { ReportsPage } from "@/features/reports/ReportsPage";
import { StatusPage } from "@/features/status/StatusPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { ComponentShowcase } from "@/features/showcase/ComponentShowcase";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export const router = createBrowserRouter([
  // Public Authentication Routes (Preview)
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // Protected Application Shell Routes (Demo Analyst Session)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "workspace",
        element: <WorkspacePage />,
      },
      {
        path: "scenes",
        element: <SceneExplorerPage />,
      },
      {
        path: "signatures",
        element: <SpectralLibraryPage />,
      },
      {
        path: "analysis/new",
        element: <AnalysisStudioPage />,
      },
      {
        path: "jobs",
        element: <JobsPage />,
      },
      {
        path: "jobs/:jobId",
        element: <JobDetailPage />,
      },
      {
        path: "results",
        element: <ResultsExplorerPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "status",
        element: <StatusPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "design-system",
        element: <ComponentShowcase />,
      },
      {
        path: "*",
        element: (
          <div className="p-8 max-w-lg mx-auto mt-12">
            <EmptyState
              title="404 — Coordinate Out of Bounds"
              description="The requested workstation route does not exist or has been relocated."
              action={
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  Return to Dashboard
                </Button>
              }
            />
          </div>
        ),
      },
    ],
  },
]);

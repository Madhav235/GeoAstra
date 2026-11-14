import { AnalysisJobRecord } from "@/features/analysis/types";

export interface DerivedReport {
  id: string;
  jobId: string;
  title: string;
  summary: string;
  createdAt: string | null;
  status: "ready";
  algorithm: AnalysisJobRecord["configuration"]["algorithm"];
  aoiName: string;
  sceneName: string;
}

export function reportIdForJob(jobId: string): string {
  return `report-${jobId}`;
}

export function deriveReports(jobs: AnalysisJobRecord[]): DerivedReport[] {
  return jobs
    .filter((job) => job.status === "completed")
    .map((job): DerivedReport => ({
      id: reportIdForJob(job.id),
      jobId: job.id,
      title: `${job.configuration.algorithm.toUpperCase()} analysis report — ${job.aoiName}`,
      summary: `Illustrative report for ${job.sceneName}; linked to the completed job configuration and its Phase 9 result fixture.`,
      createdAt: job.completedAt,
      status: "ready",
      algorithm: job.configuration.algorithm,
      aoiName: job.aoiName,
      sceneName: job.sceneName,
    }))
    .sort((left, right) => (Date.parse(right.createdAt ?? "") || 0) - (Date.parse(left.createdAt ?? "") || 0));
}

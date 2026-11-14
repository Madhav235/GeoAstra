import { create } from "zustand";
import { AnalysisJobRecord } from "@/features/analysis/types";

const STORAGE_KEY = "geoastra_demo_analysis_jobs";

function isAnalysisJobRecord(value: unknown): value is AnalysisJobRecord {
  if (!value || typeof value !== "object") return false;
  const job = value as Partial<AnalysisJobRecord>;
  return typeof job.id === "string" &&
    job.status === "queued" &&
    job.demo === true &&
    typeof job.submittedAt === "string" &&
    typeof job.aoiName === "string" &&
    typeof job.sceneName === "string" &&
    !!job.configuration;
}

function readJobs(): AnalysisJobRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isAnalysisJobRecord);
  } catch (error) {
    console.error("Failed to load demo analysis jobs:", error);
    return [];
  }
}

function persistJobs(jobs: AnalysisJobRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

interface DemoAnalysisJobState {
  jobs: AnalysisJobRecord[];
  addJob: (job: AnalysisJobRecord) => void;
}

export const useDemoAnalysisJobStore = create<DemoAnalysisJobState>((set, get) => ({
  jobs: readJobs(),
  addJob: (job) => {
    if (get().jobs.some((item) => item.id === job.id)) {
      throw new Error(`Demo analysis job ID already exists: ${job.id}`);
    }
    const jobs = [job, ...get().jobs];
    persistJobs(jobs);
    set({ jobs });
  },
}));

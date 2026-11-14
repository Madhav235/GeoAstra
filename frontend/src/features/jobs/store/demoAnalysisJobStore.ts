import { create } from "zustand";
import { AnalysisConfiguration, AnalysisJobLog, AnalysisJobRecord } from "@/features/analysis/types";

const STORAGE_KEY = "geoastra_demo_analysis_jobs";
const ACTIVE_STATUSES = new Set(["queued", "processing"]);
const STAGES = ["queued", "preparing", "preprocessing", "running", "finalizing", "completed"] as const;
type ActiveStage = typeof STAGES[number];

function stoppableStage(stage: AnalysisJobRecord["currentStage"]): AnalysisJobRecord["failureStage"] {
  switch (stage) {
    case "queued":
    case "preparing":
    case "preprocessing":
    case "running":
    case "finalizing":
      return stage;
    default:
      return null;
  }
}

const STAGE_START_SECONDS: Record<ActiveStage, number> = {
  queued: 0,
  preparing: 2,
  preprocessing: 5,
  running: 10,
  finalizing: 17,
  completed: 22,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}

function isAnalysisConfiguration(value: unknown): value is AnalysisConfiguration {
  if (!isRecord(value) || !isRecord(value.pca) || !isRecord(value.algorithmSettings)) return false;
  const algorithms = ["rxd", "mf", "cem", "fusion"];
  const normalizations = ["none", "min-max", "z-score", "l2"];
  const settings = value.algorithmSettings;
  return (value.aoiId === null || typeof value.aoiId === "string") &&
    (value.sceneId === null || typeof value.sceneId === "string") &&
    algorithms.includes(String(value.algorithm)) &&
    (value.targetSignatureId === null || typeof value.targetSignatureId === "string") &&
    settings.algorithm === value.algorithm &&
    isRecord(settings.parameters) &&
    normalizations.includes(String(value.normalization)) &&
    typeof value.pca.enabled === "boolean" &&
    typeof value.pca.components === "number" &&
    Number.isFinite(value.pca.components) &&
    typeof value.thresholdPercentile === "number" &&
    Number.isFinite(value.thresholdPercentile);
}

function stageForStatus(status: unknown): AnalysisJobRecord["currentStage"] {
  if (status === "processing") return "preparing";
  if (status === "completed") return "completed";
  if (status === "failed") return "failed";
  if (status === "cancelled") return "cancelled";
  return "queued";
}

function normalizeJob(value: unknown): AnalysisJobRecord | null {
  if (!isRecord(value) ||
      typeof value.id !== "string" ||
      value.demo !== true ||
      typeof value.submittedAt !== "string" ||
      typeof value.aoiName !== "string" ||
      typeof value.sceneName !== "string" ||
      !isAnalysisConfiguration(value.configuration)) return null;

  const statuses = ["queued", "processing", "completed", "failed", "cancelled"];
  const status = statuses.includes(String(value.status))
    ? value.status as AnalysisJobRecord["status"]
    : null;
  if (!status || !Number.isFinite(Date.parse(value.submittedAt))) return null;

  const logs = Array.isArray(value.logs)
    ? value.logs.filter((log): log is AnalysisJobLog =>
      isRecord(log) && typeof log.timestamp === "string" && typeof log.message === "string")
    : [{
      timestamp: value.submittedAt,
      message: "Job accepted into the DEMO queue; no real processing was started.",
    }];
  const terminalTime = status === "completed" ? value.completedAt
    : status === "failed" ? value.failedAt
      : status === "cancelled" ? value.cancelledAt : null;
  const elapsedFromDates = typeof terminalTime === "string" && Number.isFinite(Date.parse(terminalTime))
    ? Math.max(0, Math.floor((Date.parse(terminalTime) - Date.parse(value.submittedAt)) / 1000))
    : 0;
  const progress = typeof value.progress === "number" && Number.isFinite(value.progress)
    ? Math.min(100, Math.max(0, value.progress))
    : status === "completed" ? 100 : 0;

  return {
    id: value.id,
    name: typeof value.name === "string" ? value.name : `${String(value.configuration.algorithm ?? "Analysis").toUpperCase()} demo analysis`,
    status,
    demo: true,
    submittedAt: value.submittedAt,
    startedAt: typeof value.startedAt === "string" ? value.startedAt : null,
    completedAt: typeof value.completedAt === "string" ? value.completedAt : null,
    failedAt: typeof value.failedAt === "string" ? value.failedAt : null,
    cancelledAt: typeof value.cancelledAt === "string" ? value.cancelledAt : null,
    elapsedSeconds: typeof value.elapsedSeconds === "number" && Number.isFinite(value.elapsedSeconds)
      ? Math.max(0, value.elapsedSeconds)
      : elapsedFromDates,
    progress: status === "completed" ? 100 : progress,
    currentStage: ["queued", "preparing", "preprocessing", "running", "finalizing", "completed", "failed", "cancelled"]
      .includes(String(value.currentStage))
      ? value.currentStage as AnalysisJobRecord["currentStage"]
      : stageForStatus(status),
    failureStage: ["queued", "preparing", "preprocessing", "running", "finalizing"]
      .includes(String(value.failureStage))
      ? value.failureStage as AnalysisJobRecord["failureStage"]
      : null,
    stoppedAtStage: ["queued", "preparing", "preprocessing", "running", "finalizing"]
      .includes(String(value.stoppedAtStage))
      ? value.stoppedAtStage as AnalysisJobRecord["stoppedAtStage"]
      : null,
    failureMessage: typeof value.failureMessage === "string" ? value.failureMessage : null,
    retryOf: typeof value.retryOf === "string" ? value.retryOf : null,
    logs,
    configuration: value.configuration,
    aoiName: value.aoiName,
    sceneName: value.sceneName,
    targetSignatureName: typeof value.targetSignatureName === "string" ? value.targetSignatureName : null,
  };
}

function readJobs(): AnalysisJobRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map(normalizeJob).filter((job): job is AnalysisJobRecord => job !== null)
      : [];
  } catch (error) {
    console.error("Failed to load demo analysis jobs:", error);
    return [];
  }
}

function persistJobs(jobs: AnalysisJobRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

function createJobId(): string {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Secure random ID generation is unavailable; the demo job was not created.");
  }
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `job-demo-${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function progressAt(elapsedSeconds: number): number {
  if (elapsedSeconds < 2) return 0;
  if (elapsedSeconds < 5) return Math.round(15 + ((elapsedSeconds - 2) / 3) * 30);
  if (elapsedSeconds < 10) return Math.round(45 + ((elapsedSeconds - 5) / 5) * 40);
  if (elapsedSeconds < 17) return Math.round(85 + ((elapsedSeconds - 10) / 7) * 14);
  return 99;
}

function stageAt(elapsedSeconds: number): ActiveStage {
  if (elapsedSeconds < 2) return "queued";
  if (elapsedSeconds < 5) return "preparing";
  if (elapsedSeconds < 10) return "preprocessing";
  if (elapsedSeconds < 17) return "running";
  if (elapsedSeconds < 22) return "finalizing";
  return "completed";
}

function appendStageLogs(job: AnalysisJobRecord, stage: ActiveStage, at: string): AnalysisJobLog[] {
  const messages: Partial<Record<ActiveStage, string[]>> = {
    preparing: ["Input AOI reference resolved.", "Scene catalogue metadata loaded."],
    preprocessing: [
      "Preprocessing configuration initialized.",
      `Normalization configuration prepared (${job.configuration.normalization}).`,
      ...(job.configuration.pca.enabled
        ? [`PCA configuration prepared (${job.configuration.pca.components} components).`]
        : ["PCA is disabled in this configuration."]),
    ],
    running: [`${job.configuration.algorithm.toUpperCase()} stage entered in DEMO mode; no algorithm executed.`],
    finalizing: ["Demo workflow finalization started; no scientific output is being generated."],
    completed: ["DEMO lifecycle completed without executing a real algorithm or producing scientific results."],
  };
  return [...job.logs, ...(messages[stage] ?? []).map((message) => ({ timestamp: at, message }))];
}

function advanceJobs(jobs: AnalysisJobRecord[], now: number): AnalysisJobRecord[] {
  let changed = false;
  const updated = jobs.map((job) => {
    if (!ACTIVE_STATUSES.has(job.status)) return job;
    const submittedAt = Date.parse(job.submittedAt);
    const elapsedSeconds = Math.max(0, Math.floor((now - submittedAt) / 1000));
    const nextStage = stageAt(elapsedSeconds);
    const oldIndex = Math.max(0, STAGES.indexOf(job.currentStage as ActiveStage));
    const nextIndex = STAGES.indexOf(nextStage);
    let logs = job.logs;
    for (let index = oldIndex + 1; index <= nextIndex; index += 1) {
      const stage = STAGES[index];
      logs = appendStageLogs(
        { ...job, logs },
        stage,
        new Date(submittedAt + STAGE_START_SECONDS[stage] * 1000).toISOString()
      );
    }

    const completed = nextStage === "completed";
    const nextJob: AnalysisJobRecord = {
      ...job,
      status: completed ? "completed" : nextStage === "queued" ? "queued" : "processing",
      currentStage: nextStage,
      startedAt: job.startedAt ?? (nextStage === "queued" ? null : new Date(submittedAt + 2000).toISOString()),
      completedAt: completed ? new Date(submittedAt + 22000).toISOString() : job.completedAt,
      elapsedSeconds: completed ? Math.max(0, Math.floor((submittedAt + 22000 - submittedAt) / 1000)) : elapsedSeconds,
      progress: completed ? 100 : Math.max(job.progress, progressAt(elapsedSeconds)),
      logs,
    };
    changed = changed || nextJob.status !== job.status ||
      nextJob.currentStage !== job.currentStage ||
      nextJob.progress !== job.progress ||
      nextJob.elapsedSeconds !== job.elapsedSeconds ||
      nextJob.logs.length !== job.logs.length;
    return nextJob;
  });
  return changed ? updated : jobs;
}

interface DemoAnalysisJobState {
  jobs: AnalysisJobRecord[];
  addJob: (job: AnalysisJobRecord) => void;
  cancelJob: (id: string) => boolean;
  failJob: (id: string) => boolean;
  retryJob: (id: string) => AnalysisJobRecord;
  tick: () => void;
}

let lifecycleTimer: number | null = null;

function ensureLifecycleTimer(): void {
  if (typeof window === "undefined" || lifecycleTimer !== null) return;
  if (!useDemoAnalysisJobStore.getState().jobs.some((job) => ACTIVE_STATUSES.has(job.status))) return;
  lifecycleTimer = window.setInterval(() => useDemoAnalysisJobStore.getState().tick(), 1000);
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
    ensureLifecycleTimer();
  },
  cancelJob: (id) => {
    const job = get().jobs.find((item) => item.id === id);
    if (!job || !ACTIVE_STATUSES.has(job.status)) return false;
    const cancelledAt = new Date().toISOString();
    const stoppedAtStage = stoppableStage(job.currentStage);
    const updatedJob: AnalysisJobRecord = {
      ...job,
      status: "cancelled",
      currentStage: "cancelled",
      cancelledAt,
      stoppedAtStage,
      elapsedSeconds: Math.max(0, Math.floor((Date.parse(cancelledAt) - Date.parse(job.submittedAt)) / 1000)),
      logs: [...job.logs, { timestamp: cancelledAt, message: "DEMO job cancellation confirmed; lifecycle stopped." }],
    };
    const jobs = get().jobs.map((item) => item.id === id ? updatedJob : item);
    persistJobs(jobs);
    set({ jobs });
    return true;
  },
  failJob: (id) => {
    const job = get().jobs.find((item) => item.id === id);
    if (!job || !ACTIVE_STATUSES.has(job.status)) return false;
    const failedAt = new Date().toISOString();
    const failureStage = stoppableStage(job.currentStage) ?? "queued";
    const updatedJob: AnalysisJobRecord = {
      ...job,
      status: "failed",
      currentStage: "failed",
      failedAt,
      failureStage,
      stoppedAtStage: failureStage,
      failureMessage: "Controlled DEMO failure requested by the user; no real processing error occurred.",
      elapsedSeconds: Math.max(0, Math.floor((Date.parse(failedAt) - Date.parse(job.submittedAt)) / 1000)),
      logs: [...job.logs, { timestamp: failedAt, message: `Controlled DEMO failure at ${failureStage}; lifecycle stopped without real processing.` }],
    };
    const jobs = get().jobs.map((item) => item.id === id ? updatedJob : item);
    persistJobs(jobs);
    set({ jobs });
    return true;
  },
  retryJob: (id) => {
    const original = get().jobs.find((item) => item.id === id);
    if (!original || (original.status !== "failed" && original.status !== "cancelled")) {
      throw new Error("Only failed or cancelled demo jobs can be retried.");
    }
    let newId = createJobId();
    while (get().jobs.some((job) => job.id === newId)) newId = createJobId();
    const submittedAt = new Date().toISOString();
    const retry: AnalysisJobRecord = {
      ...original,
      id: newId,
      name: original.name.replace(/ \(retry \d+\)$/, "") + " (retry 1)",
      status: "queued",
      submittedAt,
      startedAt: null,
      completedAt: null,
      failedAt: null,
      cancelledAt: null,
      elapsedSeconds: 0,
      progress: 0,
      currentStage: "queued",
      failureStage: null,
      stoppedAtStage: null,
      failureMessage: null,
      retryOf: original.id,
      logs: [{ timestamp: submittedAt, message: `Retry accepted into DEMO queue from ${original.id}; no real processing was started.` }],
    };
    const jobs = [retry, ...get().jobs];
    persistJobs(jobs);
    set({ jobs });
    ensureLifecycleTimer();
    return retry;
  },
  tick: () => {
    const jobs = advanceJobs(get().jobs, Date.now());
    if (jobs === get().jobs) {
      if (!jobs.some((job) => ACTIVE_STATUSES.has(job.status)) && lifecycleTimer !== null && typeof window !== "undefined") {
        window.clearInterval(lifecycleTimer);
        lifecycleTimer = null;
      }
      return;
    }
    try {
      persistJobs(jobs);
    } catch (error) {
      console.error("Failed to persist demo job lifecycle update:", error);
    }
    set({ jobs });
    if (!jobs.some((job) => ACTIVE_STATUSES.has(job.status)) && lifecycleTimer !== null && typeof window !== "undefined") {
      window.clearInterval(lifecycleTimer);
      lifecycleTimer = null;
    }
  },
}));

ensureLifecycleTimer();

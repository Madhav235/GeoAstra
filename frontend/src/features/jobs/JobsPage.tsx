import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, Clock3, RotateCcw, XCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { useToast } from "@/hooks/useToast";
import { AnalysisJobRecord } from "@/features/analysis/types";
import { useDemoAnalysisJobStore } from "./store/demoAnalysisJobStore";

type JobFilter = "all" | AnalysisJobRecord["status"];
const FILTERS: JobFilter[] = ["all", "queued", "processing", "completed", "failed", "cancelled"];

function formatElapsed(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const remaining = safe % 60;
  return [hours, minutes, remaining].map((part) => String(part).padStart(2, "0")).join(":");
}

function statusVariant(status: AnalysisJobRecord["status"]): "warning" | "primary" | "success" | "danger" | "outline" {
  if (status === "queued") return "warning";
  if (status === "processing") return "primary";
  if (status === "completed") return "success";
  if (status === "failed") return "danger";
  return "outline";
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export const JobsPage: React.FC = () => {
  const jobs = useDemoAnalysisJobStore((state) => state.jobs);
  const cancelJob = useDemoAnalysisJobStore((state) => state.cancelJob);
  const retryJob = useDemoAnalysisJobStore((state) => state.retryJob);
  const toast = useToast();
  const [filter, setFilter] = useState<JobFilter>("all");
  const [newestFirst, setNewestFirst] = useState(true);
  const [confirmAction, setConfirmAction] = useState<{ type: "cancel" | "retry"; job: AnalysisJobRecord } | null>(null);

  const counts = useMemo(() => ({
    all: jobs.length,
    queued: jobs.filter((job) => job.status === "queued").length,
    processing: jobs.filter((job) => job.status === "processing").length,
    completed: jobs.filter((job) => job.status === "completed").length,
    failed: jobs.filter((job) => job.status === "failed").length,
    cancelled: jobs.filter((job) => job.status === "cancelled").length,
  }), [jobs]);
  const visibleJobs = useMemo(() => jobs
    .filter((job) => filter === "all" || job.status === filter)
    .sort((a, b) => (Date.parse(b.submittedAt) - Date.parse(a.submittedAt)) * (newestFirst ? 1 : -1)), [filter, jobs, newestFirst]);

  const confirm = () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === "cancel") {
        if (!cancelJob(confirmAction.job.id)) throw new Error("This job is no longer eligible for cancellation.");
        toast.success("Demo job cancelled", `${confirmAction.job.id} · simulated cancellation only.`);
      } else {
        const retry = retryJob(confirmAction.job.id);
        toast.success("Demo retry queued", `${retry.id} · copied configuration from the original job.`);
      }
      setConfirmAction(null);
    } catch (error) {
      toast.error("Job action failed", error instanceof Error ? error.message : "The demo job could not be updated.");
    }
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 p-4 sm:p-6 lg:p-8">
      <PageHeader
        category="PIPELINE ORCHESTRATION"
        title="Processing Jobs"
        subtitle="Track frontend-only demo lifecycle records created by Analysis Studio. No worker or scientific processing is connected."
        actions={<Badge variant="warning" size="md" dot>DEMO JOBS</Badge>}
      />

      <div className="flex items-start gap-2 rounded border border-status-warning/30 bg-status-warning/5 p-3 text-xs text-content-secondary">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-warning" />
        <p><strong className="text-status-warning">Simulated activity only.</strong> Progress and lifecycle messages are controlled frontend demonstrations; no algorithms execute and no scientific outputs are produced.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded border px-3 py-2 text-left transition-colors ${
              filter === status
                ? "border-accent-primary/50 bg-accent-primary/10"
                : "border-border-subtle bg-surface-panel hover:border-border-strong"
            }`}
          >
            <span className="block text-2xs font-mono uppercase tracking-wide text-content-muted">{status} jobs</span>
            <span className="mt-1 block font-mono text-lg font-semibold text-content-primary">{counts[status]}</span>
          </button>
        ))}
      </div>

      <Card variant="elevated">
        <div className="flex flex-col gap-3 border-b border-border-subtle p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-content-primary">Job queue <span className="ml-1 font-mono text-content-muted">({visibleJobs.length})</span></h2>
            <p className="mt-1 text-2xs text-content-muted">All rows are loaded from the shared Analysis Studio job store.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1 rounded border border-border-subtle bg-surface-secondary/40 p-1">
              {FILTERS.map((status) => (
                <button
                  key={status}
                  type="button"
                  aria-pressed={filter === status}
                  onClick={() => setFilter(status)}
                  className={`rounded px-2 py-1 text-2xs font-mono uppercase ${
                    filter === status ? "bg-surface-elevated text-accent-primary" : "text-content-muted hover:text-content-primary"
                  }`}
                >
                  {status} <span className="text-content-muted">{counts[status]}</span>
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewestFirst((current) => !current)}
              leftIcon={newestFirst ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}
              aria-label={`Sort by submission date, currently ${newestFirst ? "newest first" : "oldest first"}`}
            >
              {newestFirst ? "Newest first" : "Oldest first"}
            </Button>
          </div>
        </div>

        {visibleJobs.length === 0 ? (
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <div className="rounded-full border border-border-subtle bg-surface-secondary p-3"><ArrowUpDown className="h-5 w-5 text-content-muted" /></div>
            <p className="text-sm font-medium text-content-primary">{jobs.length === 0 ? "No demo jobs yet" : `No ${filter} jobs`}</p>
            <p className="max-w-md text-xs text-content-muted">
              {jobs.length === 0 ? "Launch a configuration from Analysis Studio to create a simulated job record." : "Choose another status filter to see matching jobs."}
            </p>
            {filter !== "all" && <Button variant="outline" size="sm" onClick={() => setFilter("all")}>Clear filter</Button>}
            {jobs.length === 0 && <Link className="text-xs text-accent-primary hover:underline" to="/analysis/new">Open Analysis Studio</Link>}
          </CardContent>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[980px] text-left">
                <thead className="bg-surface-secondary/40 text-2xs font-mono uppercase tracking-wider text-content-muted">
                  <tr>
                    <th className="px-4 py-3">Job</th><th className="px-4 py-3">Inputs</th><th className="px-4 py-3">Algorithm</th>
                    <th className="px-4 py-3">Submitted</th><th className="px-4 py-3">Status / progress</th><th className="px-4 py-3">Elapsed</th><th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {visibleJobs.map((job) => (
                    <tr key={job.id} className="align-top hover:bg-surface-elevated/20">
                      <td className="px-4 py-3">
                        <Link to={`/jobs/${encodeURIComponent(job.id)}`} className="font-mono text-xs font-semibold text-accent-primary hover:underline">{job.id}</Link>
                        <p className="mt-1 text-xs text-content-primary">{job.name}</p>
                        <Badge className="mt-1" variant="warning">DEMO</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <p className="text-content-primary">{job.aoiName}</p><p className="mt-1 text-2xs text-content-muted">AOI {job.configuration.aoiId}</p>
                        <p className="mt-2 text-content-primary">{job.sceneName}</p><p className="mt-1 text-2xs text-content-muted">Scene {job.configuration.sceneId}</p>
                      </td>
                      <td className="px-4 py-3 text-xs uppercase text-content-primary">{job.configuration.algorithm}</td>
                      <td className="px-4 py-3 text-2xs text-content-secondary">{formatDate(job.submittedAt)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant(job.status)} dot={job.status === "processing"}>{job.status}</Badge>
                        <div className="mt-2 min-w-32">
                          <div className="mb-1 flex justify-between text-2xs font-mono text-content-muted"><span>{job.currentStage}</span><span>{job.progress}%</span></div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-surface-secondary"><div className="h-full rounded-full bg-accent-primary transition-all" style={{ width: `${job.progress}%` }} /></div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-content-secondary"><Clock3 className="mr-1 inline h-3.5 w-3.5" />{formatElapsed(job.elapsedSeconds)}</td>
                      <td className="px-4 py-3">
                        <JobActions job={job} onCancel={() => setConfirmAction({ type: "cancel", job })} onRetry={() => setConfirmAction({ type: "retry", job })} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-border-subtle lg:hidden">
              {visibleJobs.map((job) => (
                <article key={job.id} className="space-y-3 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/jobs/${encodeURIComponent(job.id)}`} className="break-all font-mono text-xs font-semibold text-accent-primary hover:underline">{job.id}</Link>
                    <Badge variant="warning">DEMO</Badge><Badge variant={statusVariant(job.status)}>{job.status}</Badge>
                  </div>
                  <p className="text-sm text-content-primary">{job.name}</p>
                  <div className="grid grid-cols-2 gap-2 text-2xs">
                    <JobValue label="AOI" value={job.aoiName} />
                    <JobValue label="Scene" value={job.sceneName} />
                    <JobValue label="Algorithm" value={job.configuration.algorithm.toUpperCase()} />
                    <JobValue label="Elapsed" value={formatElapsed(job.elapsedSeconds)} />
                    <JobValue label="Submitted" value={formatDate(job.submittedAt)} />
                    <JobValue label="Progress" value={`${job.progress}% · ${job.currentStage}`} />
                  </div>
                  <div className="flex items-center gap-2 text-2xs font-mono text-content-muted"><span>{job.currentStage}</span><span>{job.progress}%</span><div className="h-1.5 min-w-20 flex-1 overflow-hidden rounded-full bg-surface-secondary"><div className="h-full rounded-full bg-accent-primary transition-all" style={{ width: `${job.progress}%` }} /></div></div>
                  <JobActions job={job} onCancel={() => setConfirmAction({ type: "cancel", job })} onRetry={() => setConfirmAction({ type: "retry", job })} />
                </article>
              ))}
            </div>
          </>
        )}
      </Card>

      <ConfirmDialog
        isOpen={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={confirm}
        isDestructive={confirmAction?.type === "cancel"}
        title={confirmAction?.type === "cancel" ? "Cancel demo job?" : "Retry demo job?"}
        confirmLabel={confirmAction?.type === "cancel" ? "Confirm cancellation" : "Create retry"}
        message={confirmAction?.type === "cancel" ? (
          <p>Cancel <span className="font-mono text-content-primary">{confirmAction.job.id}</span> while it is <strong>{confirmAction.job.status}</strong>? This only stops the simulated lifecycle.</p>
        ) : (
          <p>Create a new queued DEMO job using the configuration from <span className="font-mono text-content-primary">{confirmAction?.job.id}</span>? The original job and its history will be preserved.</p>
        )}
      />
    </div>
  );
};

function JobActions({ job, onCancel, onRetry }: { job: AnalysisJobRecord; onCancel: () => void; onRetry: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link to={`/jobs/${encodeURIComponent(job.id)}`} className="text-xs font-medium text-accent-primary hover:underline">Details</Link>
      {(job.status === "queued" || job.status === "processing") && (
        <Button size="xs" variant="ghost" leftIcon={<XCircle className="h-3 w-3" />} onClick={onCancel}>Cancel</Button>
      )}
      {(job.status === "failed" || job.status === "cancelled") && (
        <Button size="xs" variant="outline" leftIcon={<RotateCcw className="h-3 w-3" />} onClick={onRetry}>Retry</Button>
      )}
    </div>
  );
}

function JobValue({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><span className="block uppercase tracking-wide text-content-muted">{label}</span><span className="mt-0.5 block break-words text-content-secondary">{value}</span></div>;
}

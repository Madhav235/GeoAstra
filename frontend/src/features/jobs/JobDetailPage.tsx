import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock3,
  ExternalLink,
  LoaderCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useToast } from "@/hooks/useToast";
import { BUILT_IN_SCENES } from "@/features/scenes/data/sceneCatalog";
import { useSceneCatalogStore } from "@/features/scenes/store/sceneCatalogStore";
import { listScenes } from "@/features/scenes/services/mockSceneService";
import { AnalysisJobRecord } from "@/features/analysis/types";
import { useDemoAnalysisJobStore } from "./store/demoAnalysisJobStore";

const LIFECYCLE_STAGES = [
  { id: "queued", label: "Queued", detail: "Accepted into the local demo queue." },
  { id: "preparing", label: "Preparing inputs", detail: "Resolving saved AOI and scene references." },
  { id: "preprocessing", label: "Preprocessing", detail: "Preparing configured preprocessing metadata." },
  { id: "running", label: "Running algorithm", detail: "Simulated stage only; no algorithm executes." },
  { id: "finalizing", label: "Finalizing", detail: "Completing the demo lifecycle." },
  { id: "completed", label: "Completed", detail: "Demo workflow finished without scientific output." },
] as const;

function formatElapsed(seconds: number): string {
  const value = Math.max(0, Math.floor(seconds));
  return [Math.floor(value / 3600), Math.floor((value % 3600) / 60), value % 60]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

function formatTimestamp(value: string | null): string {
  return value ? new Date(value).toLocaleString() : "—";
}

function statusVariant(status: AnalysisJobRecord["status"]): "warning" | "primary" | "success" | "danger" | "outline" {
  if (status === "queued") return "warning";
  if (status === "processing") return "primary";
  if (status === "completed") return "success";
  if (status === "failed") return "danger";
  return "outline";
}

function parameterLabel(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`).replace(/^./, (letter) => letter.toUpperCase());
}

export const JobDetailPage: React.FC = () => {
  const { jobId = "" } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const job = useDemoAnalysisJobStore((state) => state.jobs.find((item) => item.id === jobId));
  const cancelJob = useDemoAnalysisJobStore((state) => state.cancelJob);
  const failJob = useDemoAnalysisJobStore((state) => state.failJob);
  const retryJob = useDemoAnalysisJobStore((state) => state.retryJob);
  const uploadedScenes = useSceneCatalogStore((state) => state.uploadedScenes);
  const [dialog, setDialog] = useState<"cancel" | "fail" | "retry" | null>(null);
  const scene = useMemo(
    () => job ? listScenes(BUILT_IN_SCENES, uploadedScenes).find((item) => item.id === job.configuration.sceneId) : undefined,
    [job, uploadedScenes]
  );

  if (!job) {
    return (
      <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6 lg:p-8">
        <PageHeader category="PROCESSING JOBS" title="Job not found" subtitle="This ID is not present in the shared local demo job store." />
        <Card><CardContent className="space-y-3 p-6">
          <p className="font-mono text-xs text-content-muted">{jobId}</p>
          <p className="text-sm text-content-secondary">The job may have been cleared from this browser or the link may be incorrect.</p>
          <Link to="/jobs"><Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>Back to Processing Jobs</Button></Link>
        </CardContent></Card>
      </div>
    );
  }

  const active = job.status === "queued" || job.status === "processing";
  const terminalTime = job.completedAt ?? job.failedAt ?? job.cancelledAt;
  const parameterEntries = Object.entries(job.configuration.algorithmSettings.parameters);
  const stepIndex = job.status === "completed"
    ? LIFECYCLE_STAGES.length - 1
    : LIFECYCLE_STAGES.findIndex((stage) => stage.id === (
      job.status === "failed" ? job.failureStage ?? "queued"
        : job.status === "cancelled" ? job.stoppedAtStage ?? "queued"
          : job.currentStage
    ));

  const performAction = () => {
    try {
      if (dialog === "cancel") {
        if (!cancelJob(job.id)) throw new Error("This job is no longer eligible for cancellation.");
        toast.success("Demo job cancelled", "The simulated lifecycle has stopped.");
      } else if (dialog === "fail") {
        if (!failJob(job.id)) throw new Error("This job is no longer eligible for the demo failure action.");
        toast.warning("Demo failure recorded", "This is a controlled simulated failure, not a processing error.");
      } else if (dialog === "retry") {
        const retry = retryJob(job.id);
        toast.success("Demo retry queued", `${retry.id} · the original record was preserved.`);
        navigate(`/jobs/${encodeURIComponent(retry.id)}`);
      }
      setDialog(null);
    } catch (error) {
      toast.error("Job action failed", error instanceof Error ? error.message : "The requested demo action could not be completed.");
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 sm:p-6 lg:p-8">
      <PageHeader
        category="PROCESSING JOB DETAIL"
        title={job.name}
        subtitle="Lifecycle, configuration, and logs for this locally persisted DEMO job."
        actions={<div className="flex flex-wrap items-center gap-2"><Badge variant={statusVariant(job.status)} dot>{job.status}</Badge><Badge variant="warning">DEMO</Badge></div>}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs text-content-secondary hover:text-accent-primary"><ArrowLeft className="h-3.5 w-3.5" />Back to Processing Jobs</Link>
        <div className="flex flex-wrap gap-2">
          <Link to="/analysis/new" className="text-xs text-accent-primary hover:underline">Analysis Studio <ExternalLink className="inline h-3 w-3" /></Link>
          <Link to="/scenes" className="text-xs text-accent-primary hover:underline">Scene Explorer <ExternalLink className="inline h-3 w-3" /></Link>
          <Link to="/workspace" className="text-xs text-accent-primary hover:underline">Geospatial Studio <ExternalLink className="inline h-3 w-3" /></Link>
          <Link to="/signatures" className="text-xs text-accent-primary hover:underline">Spectral Library <ExternalLink className="inline h-3 w-3" /></Link>
        </div>
      </div>

      {job.status === "completed" && (
        <div role="status" className="flex items-start gap-2 rounded border border-status-success/30 bg-status-success/5 p-3 text-xs text-status-success">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p><strong>Demo lifecycle completed.</strong> No real algorithm executed and no scientific results were produced.</p>
        </div>
      )}
      {job.status === "failed" && (
        <div role="status" className="flex items-start gap-2 rounded border border-status-danger/30 bg-status-danger/5 p-3 text-xs text-status-danger">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p><strong>Controlled DEMO failure at {job.failureStage ?? "unknown stage"}.</strong> {job.failureMessage ?? "No real processing error occurred."}</p>
        </div>
      )}
      {job.status === "cancelled" && (
        <div role="status" className="rounded border border-border-subtle bg-surface-secondary/40 p-3 text-xs text-content-secondary">
          Simulated cancellation stopped the lifecycle at {job.stoppedAtStage ?? "an unavailable stage"}; no real processing was active.
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
        <Card variant="elevated">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-subtle p-4">
            <div><h2 className="text-sm font-semibold text-content-primary">Lifecycle</h2><p className="mt-1 text-2xs text-content-muted">Simulated stages only · no scientific processing</p></div>
            <div className="flex gap-2">
              {active && <Button size="sm" variant="outline" onClick={() => setDialog("cancel")}>Cancel job</Button>}
              {active && <Button size="sm" variant="destructive" onClick={() => setDialog("fail")}>Simulate failure</Button>}
              {(job.status === "failed" || job.status === "cancelled") && <Button size="sm" variant="outline" leftIcon={<RotateCcw className="h-3.5 w-3.5" />} onClick={() => setDialog("retry")}>Retry</Button>}
            </div>
          </div>
          <CardContent className="space-y-5 p-4">
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs">
              <Metric label="Job ID" value={job.id} mono />
              <Metric label="Submitted" value={formatTimestamp(job.submittedAt)} />
              <Metric label="Started" value={formatTimestamp(job.startedAt)} />
              <Metric label="Terminal timestamp" value={formatTimestamp(terminalTime)} />
              <Metric label="Elapsed" value={formatElapsed(job.elapsedSeconds)} mono />
              <Metric label="Algorithm" value={job.configuration.algorithm.toUpperCase()} />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-2xs font-mono text-content-secondary"><span>Simulated progress</span><span>{job.progress}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-secondary"><div className="h-full rounded-full bg-accent-primary transition-all duration-500" style={{ width: `${job.progress}%` }} /></div>
            </div>
            <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {LIFECYCLE_STAGES.map((stage, index) => {
                const isFailedStage = job.status === "failed" && index === stepIndex;
                const isCancelledStage = job.status === "cancelled" && index === stepIndex;
                const complete = job.status === "completed" || index < stepIndex;
                const current = active && index === stepIndex;
                return (
                  <li key={stage.id} className={`flex min-h-[72px] items-start gap-2 rounded border p-2.5 ${
                    isFailedStage ? "border-status-danger/40 bg-status-danger/5" :
                    isCancelledStage ? "border-status-warning/40 bg-status-warning/5" :
                    current ? "border-accent-primary/40 bg-accent-primary/5" :
                    complete ? "border-status-success/25 bg-status-success/5" : "border-border-subtle bg-surface-secondary/20"
                  }`}>
                    {complete ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-status-success" /> :
                      isFailedStage ? <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-status-danger" /> :
                      isCancelledStage ? <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-status-warning" /> :
                      current ? <LoaderCircle className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-accent-primary" /> :
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-content-muted" />}
                    <div><p className="text-xs font-medium text-content-primary">{stage.label}</p><p className="mt-1 text-2xs leading-relaxed text-content-muted">{stage.detail}</p></div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <div className="border-b border-border-subtle p-4"><h2 className="text-sm font-semibold text-content-primary">Job overview</h2></div>
          <CardContent className="space-y-3 p-4">
            <Metric label="AOI" value={job.aoiName} />
            <Metric label="AOI ID" value={job.configuration.aoiId ?? "Unavailable"} mono />
            <Metric label="Scene" value={job.sceneName} />
            <Metric label="Scene ID" value={job.configuration.sceneId ?? "Unavailable"} mono />
            <Metric label="Sensor / platform" value={scene ? `${scene.sensor} · ${scene.sensorType}` : "Unavailable in current scene catalogue"} />
            <Metric label="Target signature" value={job.targetSignatureName ?? "Not required / not selected"} />
            {job.retryOf && <Metric label="Retry of" value={job.retryOf} mono />}
            {scene?.acquisitionDate && <Metric label="Acquisition date" value={scene.acquisitionDate} />}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card variant="default">
          <div className="border-b border-border-subtle px-4 py-3"><h2 className="text-sm font-semibold text-content-primary">Input configuration</h2></div>
          <CardContent className="grid gap-x-6 gap-y-3 p-4 sm:grid-cols-2">
            <Metric label="Normalization" value={job.configuration.normalization} />
            <Metric label="PCA" value={job.configuration.pca.enabled ? `Enabled · ${job.configuration.pca.components} components` : "Disabled"} />
            <Metric label="Threshold percentile" value={`${job.configuration.thresholdPercentile}%`} />
            {job.configuration.targetSignatureId && <Metric label="Target signature ID" value={job.configuration.targetSignatureId} mono />}
            {scene?.spatialResolutionM !== null && scene?.spatialResolutionM !== undefined && <Metric label="Spatial resolution" value={`${scene.spatialResolutionM} m`} />}
            {scene?.spectralBands !== null && scene?.spectralBands !== undefined && <Metric label="Spectral bands" value={String(scene.spectralBands)} />}
            {scene && <Metric
              label="Bad-band metadata"
              value={scene.badBandRanges?.length
                ? scene.badBandRanges.map(([start, end]) => `${start}–${end}`).join(", ")
                : scene.badBandIndices?.length
                  ? scene.badBandIndices.join(", ")
                  : "Unavailable for this scene"}
            />}
          </CardContent>
        </Card>
        <Card variant="default">
          <div className="border-b border-border-subtle px-4 py-3"><h2 className="text-sm font-semibold text-content-primary">Algorithm parameters</h2></div>
          <CardContent className="grid gap-x-6 gap-y-3 p-4 sm:grid-cols-2">
            {parameterEntries.map(([key, value]) => <Metric key={key} label={parameterLabel(key)} value={String(value)} />)}
          </CardContent>
        </Card>
      </section>

      <Card variant="elevated">
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <div><h2 className="text-sm font-semibold text-content-primary">Simulated execution log</h2><p className="mt-1 text-2xs text-content-muted">Chronological DEMO lifecycle events associated with this job.</p></div>
          <Badge variant="warning">DEMO LOG</Badge>
        </div>
        <div className="max-h-80 space-y-1.5 overflow-y-auto bg-[#07111b] p-3 font-mono text-2xs">
          {[...job.logs].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)).map((entry, index) => (
            <div key={`${entry.timestamp}-${index}`} className="grid gap-1 sm:grid-cols-[160px_1fr]">
              <time dateTime={entry.timestamp} className="text-content-muted">{new Date(entry.timestamp).toLocaleString()}</time>
              <p className="text-content-secondary">{entry.message}</p>
            </div>
          ))}
          {job.logs.length === 0 && <p className="text-content-muted">No lifecycle events are recorded yet.</p>}
        </div>
      </Card>

      <ConfirmDialog
        isOpen={dialog !== null}
        onClose={() => setDialog(null)}
        onConfirm={performAction}
        isDestructive={dialog === "cancel"}
        title={dialog === "cancel" ? "Cancel demo job?" : dialog === "fail" ? "Trigger controlled demo failure?" : "Retry demo job?"}
        confirmLabel={dialog === "cancel" ? "Confirm cancellation" : dialog === "fail" ? "Simulate failure" : "Create retry"}
        message={
          dialog === "cancel" ? <p>Cancel <span className="font-mono text-content-primary">{job.id}</span> while it is {job.status}? This simulated cancellation freezes progress and stops lifecycle updates.</p> :
          dialog === "fail" ? <p>Mark <span className="font-mono text-content-primary">{job.id}</span> as failed at its current stage? This is a deliberate DEMO state, not a real processing error.</p> :
          <p>Create a new queued DEMO job using this configuration? The original job and its history will remain unchanged.</p>
        }
      />
      {active && <div className="flex items-center gap-2 text-2xs text-content-muted"><Clock3 className="h-3.5 w-3.5" />This page updates from the shared job store; elapsed time and lifecycle progress are advanced centrally.</div>}
    </div>
  );
};

function Metric({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-2xs uppercase tracking-wide text-content-muted">{label}</p>
      <p className={`mt-0.5 break-words text-xs text-content-primary ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

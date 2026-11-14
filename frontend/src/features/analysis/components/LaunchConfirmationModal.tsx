import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { AnalysisJobRecord } from "@/features/analysis/types";

export function LaunchConfirmationModal({
  isOpen,
  onClose,
  aoiName,
  sceneName,
  algorithmName,
  targetSignatureName,
  preprocessing,
  thresholdPercentile,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  aoiName: string;
  sceneName: string;
  algorithmName: string;
  targetSignatureName: string | null;
  preprocessing: string[];
  thresholdPercentile: number;
  onConfirm: () => AnalysisJobRecord;
}) {
  const [job, setJob] = useState<AnalysisJobRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setJob(null);
      setError("");
    }
  }, [isOpen]);

  const confirm = () => {
    setError("");
    try {
      setJob(onConfirm());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The demo job could not be created.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={job ? "Demo Job Queued" : "Confirm Demo Analysis"}
      description={job ? "The mock job is available in the shared Jobs queue." : "Review this configuration before creating a simulated job."}
      size="md"
      closeOnOverlayClick={!job}
      footer={job ? (
        <>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Link to="/jobs"><Button>View Jobs</Button></Link>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={confirm}>Confirm &amp; Launch Demo</Button>
        </>
      )}
    >
      {job ? (
        <div role="status" className="space-y-3">
          <div className="flex items-start gap-2 rounded border border-status-success/30 bg-status-success/5 p-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-status-success" />
            <div>
              <p className="text-sm font-semibold text-content-primary">Queued · Demo only</p>
              <p className="mt-1 break-all font-mono text-xs text-accent-primary">{job.id}</p>
            </div>
          </div>
          <p className="text-xs text-content-secondary">
            This record contains configuration metadata only. No processing, detection output, or scientific result was generated.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-3 gap-y-2 rounded border border-border-subtle bg-surface-secondary/40 p-3 text-xs">
            <SummaryItem label="AOI" value={aoiName} />
            <SummaryItem label="Scene" value={sceneName} />
            <SummaryItem label="Algorithm" value={algorithmName} />
            {targetSignatureName && <SummaryItem label="Target" value={targetSignatureName} />}
            <SummaryItem label="Preprocessing" value={preprocessing.join(" · ")} />
            <SummaryItem label="Threshold" value={`${thresholdPercentile}%ile`} />
          </div>
          <div className="flex items-start gap-2 rounded border border-status-warning/30 bg-status-warning/10 p-3 text-xs">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-warning" />
            <p className="text-content-secondary"><strong className="text-status-warning">DEMO MODE.</strong> Confirming creates one queued mock job record. It does not execute an algorithm, access satellite data, or generate analysis results.</p>
          </div>
          {error && <p role="alert" className="rounded border border-status-danger/30 bg-status-danger/5 p-2 text-xs text-status-danger">{error}</p>}
        </div>
      )}
    </Modal>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="text-content-muted">{label}</span>
      <span className="break-words font-medium text-content-primary">{value}</span>
    </>
  );
}

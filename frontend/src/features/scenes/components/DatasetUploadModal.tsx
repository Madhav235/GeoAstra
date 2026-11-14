import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileArchive, FileUp, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { createUploadedScene, MAX_UPLOAD_BYTES, simulateDatasetUpload, validateDatasetFile } from "../services/mockSceneService";
import { SceneCatalogItem } from "../types";

type UploadStatus = "idle" | "uploading" | "success" | "failure";

interface DatasetUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (scene: SceneCatalogItem) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_000_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  if (bytes < 1_000_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${(bytes / 1_000_000_000).toFixed(2)} GB`;
}

export const DatasetUploadModal: React.FC<DatasetUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [validationError, setValidationError] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) return;
    controllerRef.current?.abort();
    controllerRef.current = null;
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setValidationError("");
    setFailureMessage("");
  }, [isOpen]);

  const chooseFile = (candidate?: File) => {
    if (!candidate) return;
    const error = validateDatasetFile(candidate);
    setFile(candidate);
    setValidationError(error ?? "");
    setStatus("idle");
    setProgress(0);
    setFailureMessage("");
  };

  const startUpload = async () => {
    if (!file) {
      setValidationError("Choose a dataset file to continue.");
      return;
    }
    const error = validateDatasetFile(file);
    if (error) {
      setValidationError(error);
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setValidationError("");
    setFailureMessage("");
    setStatus("uploading");
    setProgress(0);
    try {
      await simulateDatasetUpload(file, setProgress, controller.signal);
      const scene = createUploadedScene(file);
      onUploadComplete(scene);
      setStatus("success");
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === "AbortError") {
        setStatus("idle");
        setProgress(0);
        return;
      }
      setStatus("failure");
      setFailureMessage(reason instanceof Error ? reason.message : "The simulated upload failed.");
    } finally {
      controllerRef.current = null;
    }
  };

  const cancelUpload = () => {
    if (status === "uploading") {
      controllerRef.current?.abort();
      return;
    }
    onClose();
  };
  const closeModal = () => {
    controllerRef.current?.abort();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Upload Dataset"
      description="Validate a local file and simulate adding a catalogue entry. No file is sent to a server."
      size="lg"
      closeOnOverlayClick={status !== "uploading"}
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <p className="hidden text-2xs text-content-muted sm:block">Maximum demo file size: 1 GB</p>
          <div className="ml-auto flex gap-2">
            {status === "success" ? (
              <Button variant="primary" onClick={onClose}>Done</Button>
            ) : (
              <>
                <Button variant="outline" onClick={cancelUpload}>
                  {status === "uploading" ? "Cancel upload" : "Cancel"}
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<FileUp className="h-4 w-4" />}
                  disabled={!file || !!validationError || status === "uploading"}
                  onClick={startUpload}
                >
                  Simulate Upload
                </Button>
              </>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <input
          ref={inputRef}
          type="file"
          accept=".tif,.tiff,.hdr,.raw,.zip"
          className="hidden"
          onChange={(event) => chooseFile(event.target.files?.[0])}
        />
        <button
          type="button"
          disabled={status === "uploading"}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            chooseFile(event.dataTransfer.files[0]);
          }}
          className={`flex w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center transition-colors ${
            isDragging ? "border-accent-primary bg-accent-primary/10" : "border-border-strong bg-surface-secondary/40"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <UploadCloud className="mb-3 h-8 w-8 text-accent-primary" />
          <span className="text-sm font-semibold text-content-primary">Drop a dataset file here or browse</span>
          <span className="mt-1 text-xs text-content-muted">Accepted: .tif, .tiff, .hdr, .raw, .zip • Up to 1 GB</span>
          <span className="mt-3 rounded border border-border-subtle px-3 py-1 text-xs text-content-secondary">Browse files</span>
        </button>

        {file && (
          <div className="flex items-start gap-3 rounded border border-border-subtle bg-surface-secondary/40 p-3">
            <FileArchive className="mt-0.5 h-4 w-4 shrink-0 text-accent-primary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-content-primary">{file.name}</p>
              <p className="mt-1 text-xs text-content-muted">
                {formatBytes(file.size)} · {file.name.split(".").pop()?.toUpperCase()} ·{" "}
                {validationError ? "Validation failed" : "Format and size accepted"}
              </p>
            </div>
            {!validationError && <CheckCircle2 className="h-4 w-4 text-status-success" />}
          </div>
        )}

        {validationError && (
          <div role="alert" className="flex gap-2 rounded border border-status-danger/30 bg-status-danger/10 p-3 text-xs text-status-danger">
            <AlertCircle className="h-4 w-4 shrink-0" /> {validationError}
          </div>
        )}

        {status === "uploading" && (
          <div aria-live="polite" className="space-y-2 rounded border border-accent-primary/30 bg-accent-primary/5 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-content-primary"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Simulating local upload</span>
              <span className="font-mono text-accent-primary">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-surface-panel">
              <div className="h-full rounded bg-accent-primary transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-2xs text-content-muted">No network transfer or permanent storage occurs.</p>
          </div>
        )}

        {status === "success" && (
          <div role="status" className="rounded border border-status-success/30 bg-status-success/10 p-3 text-xs text-status-success">
            Demo catalogue entry added with PENDING METADATA status. The file itself was not stored, and this entry will be lost on refresh.
          </div>
        )}

        {status === "failure" && (
          <div role="alert" className="flex gap-2 rounded border border-status-danger/30 bg-status-danger/10 p-3 text-xs text-status-danger">
            <AlertCircle className="h-4 w-4 shrink-0" /> {failureMessage}
          </div>
        )}

        <p className="text-2xs leading-relaxed text-content-muted">
          The selected file is only checked in this browser session. A filename containing “simulate-failure” triggers the demo failure state for testing.
          The file is not uploaded or persisted; successful catalogue entries are temporary and disappear when this page is refreshed.
          Configured limit: {formatBytes(MAX_UPLOAD_BYTES)}.
        </p>
      </div>
    </Modal>
  );
};

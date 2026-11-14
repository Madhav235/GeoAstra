import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { makeCustomSignature, parseSpectrumCsv, validateSpectrum } from "../services/signatureService";
import { SIGNATURE_CATEGORIES, SignatureCategory, SpectralSignature, WavelengthUnit, ReflectanceUnit } from "../types";

const SENSOR_OPTIONS = ["AVIRIS-NG", "ROSIS", "EMIT", "Generic spectral reference"];

export const SignatureCsvImportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onImport: (signature: SpectralSignature) => void;
}> = ({ isOpen, onClose, onImport }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SignatureCategory>("Vegetation");
  const [sensor, setSensor] = useState("Generic spectral reference");
  const [wavelengthUnit, setWavelengthUnit] = useState<WavelengthUnit>("nm");
  const [reflectanceUnit, setReflectanceUnit] = useState<ReflectanceUnit>("Reflectance (0–1)");
  const [preview, setPreview] = useState<{ wavelength: number[]; reflectance: number[] } | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setFile(null);
    setName("");
    setCategory("Vegetation");
    setSensor("Generic spectral reference");
    setWavelengthUnit("nm");
    setReflectanceUnit("Reflectance (0–1)");
    setPreview(null);
    setError("");
    setProgress(0);
    setProcessing(false);
    setSuccess(false);
  };
  const close = () => {
    if (processing) return;
    reset();
    onClose();
  };

  useEffect(() => {
    if (!isOpen || !file) return;
    let cancelled = false;
    const read = async () => {
      setError("");
      setPreview(null);
      setSuccess(false);
      if (!file.name.toLocaleLowerCase().endsWith(".csv")) {
        setError("Choose a .csv file.");
        return;
      }
      if (file.size === 0) {
        setError("The selected CSV file is empty.");
        return;
      }
      try {
        const parsed = parseSpectrumCsv(await file.text());
        if (cancelled) return;
        if (parsed.error || !parsed.data) {
          setError(parsed.error ?? "Could not read the CSV spectrum.");
          return;
        }
        const validation = validateSpectrum(parsed.data.wavelength, parsed.data.reflectance, wavelengthUnit, reflectanceUnit);
        if (validation) {
          setError(validation);
          return;
        }
        setPreview(parsed.data);
        setName((current) => current || file.name.replace(/\.csv$/i, ""));
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Unable to read the selected CSV file.");
      }
    };
    void read();
    return () => { cancelled = true; };
  }, [file, isOpen, wavelengthUnit, reflectanceUnit]);

  const importFile = async () => {
    if (!preview || !name.trim()) {
      setError(!name.trim() ? "Signature name is required." : "Select and validate a CSV file first.");
      return;
    }
    setError("");
    setProcessing(true);
    setProgress(0);
    for (const value of [20, 45, 70, 100]) {
      await new Promise((resolve) => window.setTimeout(resolve, 120));
      setProgress(value);
    }
    const signature = makeCustomSignature({
      name,
      category,
      description: `Locally imported spectrum from ${file?.name ?? "CSV"}.`,
      sensor,
      wavelength: preview.wavelength,
      reflectance: preview.reflectance,
      wavelengthUnit,
      reflectanceUnit,
      dataSource: `Local CSV import: ${file?.name ?? "unknown file"}`,
    });
    onImport(signature);
    setProcessing(false);
    setSuccess(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="Import Spectral CSV"
      description="CSV is parsed locally in this browser; no file is uploaded to a server."
      size="lg"
      closeOnOverlayClick={!processing}
      footer={
        <>
          <Button variant="outline" disabled={processing} onClick={close}>Cancel</Button>
          {success
            ? <Button onClick={close}>Done</Button>
            : <Button disabled={!preview || !!error || processing} isLoading={processing} onClick={() => void importFile()}>Import Signature</Button>}
        </>
      }
    >
      <div className="space-y-4">
        <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-[220px] flex-1">
            <Input label="CSV file" value={file?.name ?? ""} readOnly placeholder="Choose a local CSV file" />
          </div>
          <Button variant="outline" disabled={processing} onClick={() => inputRef.current?.click()}>Choose CSV</Button>
        </div>
        <div className="rounded border border-border-subtle bg-surface-secondary/40 p-3">
          <p className="text-xs font-semibold text-content-primary">Expected CSV structure</p>
          <code className="mt-2 block whitespace-pre-wrap font-mono text-xs text-accent-primary">wavelength_nm,reflectance{"\n"}400,0.12{"\n"}500,0.18{"\n"}600,0.24</code>
          <p className="mt-2 text-2xs text-content-muted">Header aliases “wavelength”, “nm”, “um”, and “value” are also accepted. Use the unit selectors below to describe the values.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input label="Signature name *" value={name} onChange={(event) => setName(event.target.value)} placeholder="Imported signature" />
          <label className="flex flex-col gap-1.5 text-xs text-content-secondary">Category
            <select value={category} onChange={(event) => setCategory(event.target.value as SignatureCategory)} className="h-9 rounded border border-border-subtle bg-surface-secondary px-3 text-content-primary">
              {SIGNATURE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-content-secondary">Sensor
            <select value={sensor} onChange={(event) => setSensor(event.target.value)} className="h-9 rounded border border-border-subtle bg-surface-secondary px-3 text-content-primary">
              {SENSOR_OPTIONS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1.5 text-xs text-content-secondary">Wavelength unit
              <select value={wavelengthUnit} onChange={(event) => setWavelengthUnit(event.target.value as WavelengthUnit)} className="h-9 rounded border border-border-subtle bg-surface-secondary px-2 text-content-primary"><option value="nm">nm</option><option value="µm">µm</option></select>
            </label>
            <label className="flex flex-col gap-1.5 text-xs text-content-secondary">Reflectance unit
              <select value={reflectanceUnit} onChange={(event) => setReflectanceUnit(event.target.value as ReflectanceUnit)} className="h-9 rounded border border-border-subtle bg-surface-secondary px-2 text-content-primary"><option value="Reflectance (0–1)">0–1</option><option value="Percentage (0–100)">0–100%</option></select>
            </label>
          </div>
        </div>
        {preview && !error && (
          <div role="status" className="space-y-2 rounded border border-status-success/30 bg-status-success/5 p-3">
            <p className="flex items-center gap-2 text-xs font-medium text-status-success"><CheckCircle2 className="h-4 w-4" /> Parsed {preview.wavelength.length} spectral points</p>
            <div className="max-h-32 overflow-auto">
              <table className="w-full text-left text-2xs"><thead><tr><th>Wavelength ({wavelengthUnit})</th><th>Reflectance ({reflectanceUnit})</th></tr></thead><tbody>
                {preview.wavelength.slice(0, 6).map((wavelength, index) => <tr key={`${wavelength}-${index}`} className="border-t border-border-subtle"><td>{wavelength}</td><td>{preview.reflectance[index]}</td></tr>)}
              </tbody></table>
            </div>
          </div>
        )}
        {processing && (
          <div aria-live="polite" className="space-y-2">
            <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-content-secondary"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing locally</span><span className="font-mono text-accent-primary">{progress}%</span></div>
            <div className="h-2 rounded bg-surface-secondary"><div className="h-full rounded bg-accent-primary transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
        )}
        {success && <p role="status" className="rounded border border-status-success/30 bg-status-success/10 p-3 text-xs text-status-success">Custom signature imported and added to My Signatures. No server upload occurred.</p>}
        {error && <p role="alert" className="flex items-start gap-2 rounded border border-status-danger/30 bg-status-danger/10 p-3 text-xs text-status-danger"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
        {!file && <div className="flex items-center gap-2 text-2xs text-content-muted"><FileSpreadsheet className="h-4 w-4" />Select a CSV with at least two ordered wavelength/reflectance rows.</div>}
      </div>
    </Modal>
  );
};

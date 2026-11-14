import React, { FormEvent, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  makeCustomSignature,
  parseNumberList,
  validateSpectrum,
} from "../services/signatureService";
import {
  SIGNATURE_CATEGORIES,
  SignatureCategory,
  SpectralSignature,
  WavelengthUnit,
  ReflectanceUnit,
} from "../types";

const SENSOR_OPTIONS = ["AVIRIS-NG", "ROSIS", "EMIT", "Generic spectral reference"];

export const SignatureFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreate: (signature: SpectralSignature) => void;
}> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SignatureCategory | "">("");
  const [description, setDescription] = useState("");
  const [sensor, setSensor] = useState("");
  const [wavelengthUnit, setWavelengthUnit] = useState<WavelengthUnit>("nm");
  const [reflectanceUnit, setReflectanceUnit] = useState<ReflectanceUnit>("Reflectance (0–1)");
  const [wavelengthText, setWavelengthText] = useState("450, 550, 650, 750, 900");
  const [reflectanceText, setReflectanceText] = useState("0.12, 0.18, 0.24, 0.32, 0.38");
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setCategory("");
    setDescription("");
    setSensor("");
    setWavelengthUnit("nm");
    setReflectanceUnit("Reflectance (0–1)");
    setWavelengthText("450, 550, 650, 750, 900");
    setReflectanceText("0.12, 0.18, 0.24, 0.32, 0.38");
    setError("");
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return setError("Signature name is required.");
    if (!category) return setError("Choose a signature category.");
    if (!sensor) return setError("Choose a compatible sensor.");
    const wavelengths = parseNumberList(wavelengthText);
    const reflectances = parseNumberList(reflectanceText);
    if (!wavelengths) return setError("Wavelength values must be valid numbers separated by commas or spaces.");
    if (!reflectances) return setError("Reflectance values must be valid numbers separated by commas or spaces.");
    const validation = validateSpectrum(wavelengths, reflectances, wavelengthUnit, reflectanceUnit);
    if (validation) return setError(validation);
    onCreate(makeCustomSignature({
      name,
      category,
      description,
      sensor,
      wavelength: wavelengths,
      reflectance: reflectances,
      wavelengthUnit,
      reflectanceUnit,
    }));
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="Create Custom Signature"
      description="Enter an ordered wavelength/reflectance series. Values you enter are user-provided; no measurements are generated."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button type="submit" form="signature-create-form">Create Signature</Button>
        </>
      }
    >
      <form id="signature-create-form" className="space-y-4" onSubmit={submit} noValidate>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input label="Signature name *" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Field sample 01" />
          <label className="flex flex-col gap-1.5 text-xs text-content-secondary">
            Category *
            <select value={category} onChange={(event) => setCategory(event.target.value as SignatureCategory | "")} className="h-9 rounded border border-border-subtle bg-surface-secondary px-3 text-content-primary">
              <option value="">Select category</option>
              {SIGNATURE_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-content-secondary">
            Sensor *
            <select value={sensor} onChange={(event) => setSensor(event.target.value)} className="h-9 rounded border border-border-subtle bg-surface-secondary px-3 text-content-primary">
              <option value="">Select sensor</option>
              {SENSOR_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <Input label="Description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Optional material notes" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-xs text-content-secondary">
            Wavelength unit
            <select value={wavelengthUnit} onChange={(event) => setWavelengthUnit(event.target.value as WavelengthUnit)} className="h-9 rounded border border-border-subtle bg-surface-secondary px-3 text-content-primary">
              <option value="nm">Nanometres (nm)</option>
              <option value="µm">Micrometres (µm)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs text-content-secondary">
            Reflectance unit
            <select value={reflectanceUnit} onChange={(event) => setReflectanceUnit(event.target.value as ReflectanceUnit)} className="h-9 rounded border border-border-subtle bg-surface-secondary px-3 text-content-primary">
              <option value="Reflectance (0–1)">Reflectance (0–1)</option>
              <option value="Percentage (0–100)">Percentage (0–100)</option>
            </select>
          </label>
        </div>
        <label className="block space-y-1.5 text-xs text-content-secondary">
          Wavelength values ({wavelengthUnit}) *
          <textarea value={wavelengthText} onChange={(event) => setWavelengthText(event.target.value)} rows={3} className="w-full rounded border border-border-subtle bg-surface-secondary p-2 font-mono text-xs text-content-primary" aria-label="Wavelength values" />
        </label>
        <label className="block space-y-1.5 text-xs text-content-secondary">
          Reflectance values ({reflectanceUnit}) *
          <textarea value={reflectanceText} onChange={(event) => setReflectanceText(event.target.value)} rows={3} className="w-full rounded border border-border-subtle bg-surface-secondary p-2 font-mono text-xs text-content-primary" aria-label="Reflectance values" />
        </label>
        <p className="text-2xs text-content-muted">Enter at least two matched values in increasing wavelength order. Chart wavelengths are stored/displayed in nm.</p>
        {error && <p role="alert" className="flex items-start gap-2 rounded border border-status-danger/30 bg-status-danger/10 p-2.5 text-xs text-status-danger"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
      </form>
    </Modal>
  );
};

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { SpectralSignature } from "../types";
import { SpectralChart } from "./SpectralChart";

export const SignatureDetailModal: React.FC<{
  signature: SpectralSignature | null;
  active: boolean;
  compare: boolean;
  onClose: () => void;
  onSetActive: () => void;
  onToggleCompare: () => void;
  onDelete: () => void;
}> = ({ signature, active, compare, onClose, onSetActive, onToggleCompare, onDelete }) => {
  if (!signature) return null;
  const series = signature.reflectance.map((reflectance, index) => ({
    wavelengthNm: signature.wavelengthNm[index],
    reflectance,
  }));
  const range = signature.wavelengthNm.length
    ? `${Math.min(...signature.wavelengthNm).toFixed(2)}–${Math.max(...signature.wavelengthNm).toFixed(2)} nm`
    : "Unknown";
  const detail = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-content-primary">{signature.name}</h2>
            <Badge variant={signature.designation === "public" ? "primary" : "secondary"}>{signature.designation.toUpperCase()}</Badge>
            {active && <Badge variant="success">ACTIVE TARGET</Badge>}
          </div>
          <p className="mt-1 font-mono text-2xs text-content-muted">{signature.id}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-content-secondary">{signature.description}</p>
      {signature.illustrative && (
        <p className="rounded border border-status-warning/30 bg-status-warning/5 p-2.5 text-xs text-status-warning">
          Illustrative simulated spectral values, not verified scientific measurements.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 rounded border border-border-subtle bg-surface-secondary/40 p-3 sm:grid-cols-4">
        <DetailField label="Category" value={signature.category} />
        <DetailField label="Sensor" value={signature.sensor} />
        <DetailField label="Wavelength range" value={range} />
        <DetailField label="Spectral bands" value={String(signature.wavelengthNm.length)} />
        <DetailField label="Wavelength unit" value={signature.wavelengthUnit === "µm" ? "µm (stored as nm)" : "nm"} />
        <DetailField label="Reflectance units" value={signature.reflectanceUnit} />
        <DetailField label="Designation" value={signature.designation === "public" ? "Public reference" : "Custom"} />
        <DetailField label="Data source" value={signature.dataSource} />
      </div>
      <p className="text-2xs text-content-muted">
        Sensor compatibility: {signature.compatibleSensors.join(", ")}. {signature.illustrative ? "Curve values are simulated for interface demonstration." : "Curve values were provided by the user."}
      </p>

      <Card variant="default">
        <CardContent className="p-3">
          <SpectralChart signatures={[signature]} height={310} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-between gap-2 border-t border-border-subtle pt-3">
        <div className="flex flex-wrap gap-2">
          <Button variant={active ? "secondary" : "primary"} onClick={onSetActive}>
            {active ? "Active Target Signature" : "Set as Active Target"}
          </Button>
          <Button variant={compare ? "secondary" : "outline"} onClick={onToggleCompare}>
            {compare ? "Remove Comparison" : "Compare Curve"}
          </Button>
        </div>
        {signature.designation === "custom" && (
          <Button variant="destructive" onClick={onDelete}>Delete Custom Signature</Button>
        )}
      </div>
      <div className="sr-only" aria-label="Spectral series sample values">
        {series.map((point) => `${point.wavelengthNm} nm: ${point.reflectance}`).join(", ")}
      </div>
    </div>
  );

  return (
    <Modal isOpen={!!signature} onClose={onClose} title="Signature Details" size="xl">
      {detail}
    </Modal>
  );
};

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-2xs font-mono uppercase text-content-muted">{label}</p>
      <p className="mt-1 break-words text-xs font-medium text-content-primary">{value}</p>
    </div>
  );
}

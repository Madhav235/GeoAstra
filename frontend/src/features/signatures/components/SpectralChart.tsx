import React, { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SIGNATURE_COLORS } from "../data/mockSignatures";
import { SpectralSignature } from "../types";

interface ChartSignature extends SpectralSignature {
  chartColor?: string;
}

function interpolate(signature: SpectralSignature, wavelengthNm: number): number | null {
  const wavelengths = signature.wavelengthNm;
  const reflectance = signature.reflectance;
  if (!wavelengths.length || wavelengthNm < wavelengths[0] || wavelengthNm > wavelengths[wavelengths.length - 1]) {
    return null;
  }
  const exactIndex = wavelengths.indexOf(wavelengthNm);
  if (exactIndex >= 0) return reflectance[exactIndex];
  for (let index = 1; index < wavelengths.length; index += 1) {
    if (wavelengths[index] > wavelengthNm) {
      const ratio = (wavelengthNm - wavelengths[index - 1]) / (wavelengths[index] - wavelengths[index - 1]);
      return reflectance[index - 1] + ratio * (reflectance[index] - reflectance[index - 1]);
    }
  }
  return null;
}

function SignatureTooltip({
  active,
  payload,
  label,
  signatures,
  reflectanceUnit,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ dataKey?: unknown; value?: unknown }>;
  label?: number | string;
  signatures: ChartSignature[];
  reflectanceUnit: SpectralSignature["reflectanceUnit"];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-border-strong bg-surface-panel px-3 py-2 shadow-lg">
      <p className="mb-1 font-mono text-2xs text-content-muted">Wavelength: {Number(label).toFixed(2)} nm</p>
      {payload.filter((item) => item.value !== null && item.value !== undefined).map((item) => {
        const index = Number(String(item.dataKey).replace("signature-", ""));
        const signature = signatures[index];
        if (!signature) return null;
        const value = Number(item.value);
        const unit = reflectanceUnit === "Percentage (0–100)" ? "%" : "reflectance";
        return (
          <p key={String(item.dataKey)} className="text-xs" style={{ color: signature.chartColor ?? SIGNATURE_COLORS[index % SIGNATURE_COLORS.length] }}>
            {signature.name}: {value.toFixed(4)} {unit}
          </p>
        );
      })}
    </div>
  );
}

export const SpectralChart: React.FC<{
  signatures: ChartSignature[];
  height?: number;
}> = ({ signatures, height = 340 }) => {
  const chartData = useMemo(() => {
    const wavelengths = [...new Set(signatures.flatMap((signature) => signature.wavelengthNm))].sort((a, b) => a - b);
    const multiplier = signatures[0]?.reflectanceUnit === "Percentage (0–100)" ? 100 : 1;
    return wavelengths.map((wavelengthNm) => {
      const row: Record<string, number | null> = { wavelengthNm };
      signatures.forEach((signature, index) => {
        const reflectance = interpolate(signature, wavelengthNm);
        row[`signature-${index}`] = reflectance === null ? null : reflectance * multiplier;
      });
      return row;
    });
  }, [signatures]);

  const reflectanceUnit = signatures[0]?.reflectanceUnit ?? "Reflectance (0–1)";
  const reflectanceMax = reflectanceUnit === "Percentage (0–100)" ? 100 : 1;
  const yAxisLabel = reflectanceUnit;

  if (!signatures.length || chartData.length < 2) {
    return (
      <div className="flex items-center justify-center rounded border border-border-subtle bg-surface-panel text-xs text-content-muted" style={{ height }}>
        No spectral curve data is available for this signature.
      </div>
    );
  }

  return (
    <div className="w-full rounded border border-border-subtle bg-surface-panel p-2 sm:p-4" data-testid="spectral-chart">
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 14, right: 18, bottom: 28, left: 18 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 4" />
            <XAxis
              dataKey="wavelengthNm"
              type="number"
              domain={["dataMin", "dataMax"]}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              tickFormatter={(value: number) => `${Math.round(value)}`}
              label={{ value: "Wavelength (nm)", position: "insideBottom", offset: -16, fill: "#cbd5e1", fontSize: 11 }}
            />
            <YAxis
              type="number"
              domain={[0, reflectanceMax]}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              tickFormatter={(value: number) => Number(value).toFixed(reflectanceMax === 1 ? 1 : 0)}
              label={{ value: yAxisLabel, angle: -90, position: "insideLeft", fill: "#cbd5e1", fontSize: 11 }}
            />
            <Tooltip
              content={(props) => <SignatureTooltip {...props} signatures={signatures} reflectanceUnit={reflectanceUnit} />}
              cursor={{ stroke: "#64748b", strokeDasharray: "3 3" }}
            />
            <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 11 }} />
            {signatures.map((signature, index) => (
              <Line
                key={`${signature.id}-${index}`}
                name={signature.name}
                dataKey={`signature-${index}`}
                type="monotone"
                stroke={signature.chartColor ?? SIGNATURE_COLORS[index % SIGNATURE_COLORS.length]}
                strokeWidth={2}
                dot={{ r: signatures.length === 1 ? 2 : 0 }}
                activeDot={{ r: 5, stroke: "#0f172a", strokeWidth: 2 }}
                connectNulls={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {signatures.some((signature) => signature.reflectanceUnit !== reflectanceUnit) && signatures.length > 1 && (
        <p className="mt-1 text-right text-2xs text-content-muted">
          Comparison curves are converted to the primary signature’s displayed reflectance units.
        </p>
      )}
    </div>
  );
};

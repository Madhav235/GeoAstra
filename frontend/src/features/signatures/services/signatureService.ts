import { PUBLIC_SIGNATURES } from "../data/mockSignatures";
import {
  ReflectanceUnit,
  SignatureCategory,
  SpectralSignature,
  WavelengthUnit,
} from "../types";

export interface SignatureFilters {
  category: string;
  sensor: string;
  designation: "all" | "public" | "custom";
  sortBy: "name" | "category";
  sortDirection: "asc" | "desc";
}

export interface ParsedSpectrum {
  wavelength: number[];
  reflectance: number[];
}

export function listSignatures(custom: SpectralSignature[]): SpectralSignature[] {
  return [...PUBLIC_SIGNATURES, ...custom];
}

export function searchAndFilterSignatures(
  signatures: SpectralSignature[],
  query: string,
  filters: SignatureFilters
): SpectralSignature[] {
  const search = query.trim().toLocaleLowerCase();
  const multiplier = filters.sortDirection === "asc" ? 1 : -1;
  return signatures
    .filter((signature) => {
      const matchesSearch = !search ||
        [signature.name, signature.id, signature.description, signature.category, signature.sensor]
          .some((value) => value.toLocaleLowerCase().includes(search));
      const matchesCategory = filters.category === "all" || signature.category === filters.category;
      const matchesSensor = filters.sensor === "all" || signature.compatibleSensors.includes(filters.sensor) || signature.sensor === filters.sensor;
      const matchesDesignation = filters.designation === "all" || signature.designation === filters.designation;
      return matchesSearch && matchesCategory && matchesSensor && matchesDesignation;
    })
    .sort((a, b) => {
      const first = filters.sortBy === "name" ? a.name : a.category;
      const second = filters.sortBy === "name" ? b.name : b.category;
      return first.localeCompare(second) * multiplier;
    });
}

export function wavelengthToNanometres(value: number, unit: WavelengthUnit): number {
  return unit === "µm" ? value * 1000 : value;
}

export function toReflectanceFraction(value: number, unit: ReflectanceUnit): number {
  return unit === "Percentage (0–100)" ? value / 100 : value;
}

export function validateSpectrum(
  wavelengths: number[],
  reflectances: number[],
  wavelengthUnit: WavelengthUnit,
  reflectanceUnit: ReflectanceUnit
): string | null {
  if (wavelengths.length < 2 || reflectances.length < 2) {
    return "Enter at least two wavelength and reflectance values.";
  }
  if (wavelengths.length !== reflectances.length) {
    return "Wavelength and reflectance arrays must contain the same number of values.";
  }
  if (wavelengths.some((value) => !Number.isFinite(value) || value <= 0)) {
    return "Wavelengths must be finite positive numbers.";
  }
  if (wavelengths.some((value, index) => index > 0 && value <= wavelengths[index - 1])) {
    return "Wavelengths must be strictly increasing and ordered.";
  }
  const maxReflectance = reflectanceUnit === "Percentage (0–100)" ? 100 : 1;
  if (reflectances.some((value) => !Number.isFinite(value) || value < 0 || value > maxReflectance)) {
    return `Reflectance values must be between 0 and ${maxReflectance}.`;
  }
  const nanometres = wavelengths.map((value) => wavelengthToNanometres(value, wavelengthUnit));
  if (nanometres.some((value) => value > 100_000)) {
    return "Wavelength values are outside the supported spectral range.";
  }
  return null;
}

export function parseNumberList(raw: string): number[] | null {
  const parts = raw.split(/[,\s;]+/).map((part) => part.trim()).filter(Boolean);
  if (!parts.length) return null;
  const values = parts.map(Number);
  return values.every(Number.isFinite) ? values : null;
}

export function parseSpectrumCsv(text: string): { data?: ParsedSpectrum; error?: string } {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 3) return { error: "CSV must contain a header and at least two wavelength/reflectance rows." };

  const delimiter = lines[0].includes(";") ? ";" : ",";
  const header = lines[0].split(delimiter).map((part) => part.trim().toLocaleLowerCase().replace(/[\s-]+/g, "_"));
  const wavelengthIndex = header.findIndex((column) => ["wavelength", "wavelength_nm", "wavelength_um", "wavelength_µm", "nm", "um", "µm"].includes(column));
  const reflectanceIndex = header.findIndex((column) => ["reflectance", "reflectance_0_1", "reflectance_0_100", "value"].includes(column));
  if (wavelengthIndex < 0 || reflectanceIndex < 0 || wavelengthIndex === reflectanceIndex) {
    return { error: "CSV needs wavelength and reflectance columns (for example: wavelength_nm,reflectance)." };
  }

  const wavelength: number[] = [];
  const reflectance: number[] = [];
  for (let index = 1; index < lines.length; index += 1) {
    const cells = lines[index].split(delimiter).map((part) => part.trim());
    const rawWavelength = cells[wavelengthIndex];
    const rawReflectance = cells[reflectanceIndex];
    const x = Number(rawWavelength);
    const y = Number(rawReflectance);
    if (!rawWavelength || !rawReflectance || !Number.isFinite(x) || !Number.isFinite(y)) {
      return { error: `CSV row ${index + 1} has a missing or non-numeric wavelength/reflectance value.` };
    }
    wavelength.push(x);
    reflectance.push(y);
  }
  return { data: { wavelength, reflectance } };
}

export function makeCustomSignature(input: {
  name: string;
  category: SignatureCategory;
  description: string;
  sensor: string;
  wavelength: number[];
  reflectance: number[];
  wavelengthUnit: WavelengthUnit;
  reflectanceUnit: ReflectanceUnit;
  dataSource?: string;
}): SpectralSignature {
  return {
    id: `custom-${crypto.randomUUID()}`,
    name: input.name.trim(),
    category: input.category,
    description: input.description.trim() || "User-created spectral reference. Values are provided by the user.",
    sensor: input.sensor,
    compatibleSensors: [input.sensor],
    wavelengthNm: input.wavelength.map((value) => wavelengthToNanometres(value, input.wavelengthUnit)),
    reflectance: input.reflectance.map((value) => toReflectanceFraction(value, input.reflectanceUnit)),
    wavelengthUnit: input.wavelengthUnit,
    reflectanceUnit: input.reflectanceUnit,
    dataSource: input.dataSource ?? "User-created custom signature",
    designation: "custom",
    illustrative: false,
    createdAt: new Date().toISOString(),
  };
}

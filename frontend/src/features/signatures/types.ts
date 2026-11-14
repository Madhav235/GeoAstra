export const SIGNATURE_CATEGORIES = [
  "Vegetation",
  "Minerals",
  "Water",
  "Soil",
  "Man-made materials",
  "Gas / Emission",
] as const;

export type SignatureCategory = (typeof SIGNATURE_CATEGORIES)[number];
export type WavelengthUnit = "nm" | "µm";
export type ReflectanceUnit = "Reflectance (0–1)" | "Percentage (0–100)";

export interface SpectralSignature {
  id: string;
  name: string;
  category: SignatureCategory;
  description: string;
  sensor: string;
  compatibleSensors: string[];
  wavelengthNm: number[];
  reflectance: number[];
  wavelengthUnit: WavelengthUnit;
  reflectanceUnit: ReflectanceUnit;
  dataSource: string;
  designation: "public" | "custom";
  illustrative: boolean;
  createdAt: string;
}

export interface SignaturePoint {
  wavelengthNm: number;
  reflectance: number;
}

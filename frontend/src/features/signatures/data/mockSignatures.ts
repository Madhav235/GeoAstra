import { SpectralSignature } from "../types";

const wavelengths = [400, 500, 600, 680, 720, 850, 1000, 1300, 1450, 1650, 1940, 2200, 2500];
const publicMetadata = {
  wavelengthUnit: "nm" as const,
  reflectanceUnit: "Reflectance (0–1)" as const,
  designation: "public" as const,
  illustrative: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  compatibleSensors: ["AVIRIS-NG", "ROSIS", "EMIT", "Generic spectral reference"],
};

function publicSignature(
  signature: Omit<SpectralSignature, "wavelengthNm" | "reflectance" | "compatibleSensors" | "wavelengthUnit" | "reflectanceUnit" | "designation" | "illustrative" | "createdAt">,
  reflectance: number[]
): SpectralSignature {
  return {
    ...publicMetadata,
    ...signature,
    wavelengthNm: wavelengths,
    reflectance,
  };
}

export const PUBLIC_SIGNATURES: SpectralSignature[] = [
  publicSignature(
    {
      id: "sig-chlorophyll-canopy",
      name: "Healthy Chlorophyll Canopy",
      category: "Vegetation",
      description: "Illustrative green vegetation profile with low red reflectance, a red-edge rise, and higher near-infrared response.",
      sensor: "Generic spectral reference",
      dataSource: "USGS Spectral Library reference label; curve is illustrative",
    },
    [0.035, 0.075, 0.055, 0.035, 0.24, 0.48, 0.50, 0.42, 0.25, 0.39, 0.08, 0.31, 0.18]
  ),
  publicSignature(
    {
      id: "sig-kaolinite",
      name: "Kaolinite",
      category: "Minerals",
      description: "Illustrative clay-mineral profile highlighting an Al-OH absorption feature around the shortwave infrared region.",
      sensor: "AVIRIS-NG",
      dataSource: "USGS Spectral Library reference label; curve is illustrative",
    },
    [0.21, 0.27, 0.31, 0.34, 0.36, 0.39, 0.43, 0.46, 0.42, 0.40, 0.37, 0.16, 0.29]
  ),
  publicSignature(
    {
      id: "sig-hematite",
      name: "Hematite",
      category: "Minerals",
      description: "Illustrative iron-oxide profile with a broad visible-to-near-infrared spectral shape; not a measured laboratory spectrum.",
      sensor: "EMIT",
      dataSource: "JPL ECOSTRESS library reference label; curve is illustrative",
    },
    [0.07, 0.18, 0.29, 0.36, 0.39, 0.31, 0.28, 0.26, 0.24, 0.21, 0.18, 0.15, 0.12]
  ),
  publicSignature(
    {
      id: "sig-dry-soil",
      name: "Dry Soil",
      category: "Soil",
      description: "Illustrative dry mineral soil continuum with gradual visible and near-infrared reflectance increase.",
      sensor: "Generic spectral reference",
      dataSource: "USGS Spectral Library reference label; curve is illustrative",
    },
    [0.08, 0.12, 0.16, 0.19, 0.21, 0.26, 0.29, 0.32, 0.28, 0.31, 0.25, 0.29, 0.22]
  ),
  publicSignature(
    {
      id: "sig-water",
      name: "Water",
      category: "Water",
      description: "Illustrative open-water spectrum with low reflectance and strong shortwave infrared absorption.",
      sensor: "Generic spectral reference",
      dataSource: "USGS Spectral Library reference label; curve is illustrative",
    },
    [0.05, 0.035, 0.02, 0.012, 0.008, 0.004, 0.002, 0.001, 0.0007, 0.0004, 0.0002, 0.0001, 0.0001]
  ),
  publicSignature(
    {
      id: "sig-asphalt",
      name: "Asphalt (illustrative)",
      category: "Man-made materials",
      description: "Illustrative dark asphalt surface profile provided as a material-class example, not a measured signature.",
      sensor: "ROSIS",
      dataSource: "Pavia University benchmark material label; curve is illustrative",
    },
    [0.045, 0.06, 0.075, 0.084, 0.09, 0.11, 0.13, 0.16, 0.15, 0.17, 0.13, 0.12, 0.10]
  ),
  publicSignature(
    {
      id: "sig-methane",
      name: "Methane Absorption (CH₄)",
      category: "Gas / Emission",
      description: "Illustrative methane diagnostic-reference profile. Gas absorption reference shapes are not surface reflectance measurements.",
      sensor: "AVIRIS-NG",
      dataSource: "HITRAN / JPL reference label; simulated profile",
    },
    [0.32, 0.35, 0.39, 0.41, 0.44, 0.48, 0.46, 0.43, 0.38, 0.18, 0.40, 0.20, 0.37]
  ),
];

export const SIGNATURE_COLORS = [
  "#22d3ee",
  "#34d399",
  "#f59e0b",
  "#a78bfa",
  "#fb7185",
  "#60a5fa",
  "#f97316",
];

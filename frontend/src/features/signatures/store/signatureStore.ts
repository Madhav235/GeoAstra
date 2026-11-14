import { create } from "zustand";
import { PUBLIC_SIGNATURES } from "../data/mockSignatures";
import { SpectralSignature } from "../types";

const CUSTOM_STORAGE_KEY = "geoastra_custom_spectral_signatures";
const ACTIVE_STORAGE_KEY = "geoastra_active_target_signature";
const publicIds = new Set(PUBLIC_SIGNATURES.map((signature) => signature.id));

function readCustomSignatures(): SpectralSignature[] {
  try {
    const raw = localStorage.getItem(CUSTOM_STORAGE_KEY);
    if (!raw) return [];
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter((signature): signature is SpectralSignature =>
      typeof signature?.id === "string" &&
      signature.designation === "custom" &&
      Array.isArray(signature.wavelengthNm) &&
      Array.isArray(signature.reflectance) &&
      signature.wavelengthNm.length === signature.reflectance.length
    );
  } catch (error) {
    console.error("Failed to load custom spectral signatures:", error);
    return [];
  }
}

function persistCustomSignatures(signatures: SpectralSignature[]) {
  try {
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(signatures));
  } catch (error) {
    console.error("Failed to persist custom spectral signatures:", error);
  }
}

function readActiveId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to load active target signature:", error);
    return null;
  }
}

function persistActiveId(id: string | null) {
  try {
    if (id) localStorage.setItem(ACTIVE_STORAGE_KEY, id);
    else localStorage.removeItem(ACTIVE_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to persist active target signature:", error);
  }
}

interface SignatureState {
  customSignatures: SpectralSignature[];
  activeSignatureId: string | null;
  addCustomSignature: (signature: SpectralSignature) => void;
  deleteCustomSignature: (id: string) => void;
  setActiveSignature: (id: string | null) => void;
}

export const useSignatureStore = create<SignatureState>((set, get) => {
  const customSignatures = readCustomSignatures();
  const savedActiveId = readActiveId();
  const availableIds = new Set([...publicIds, ...customSignatures.map((signature) => signature.id)]);

  return {
    customSignatures,
    activeSignatureId: savedActiveId && availableIds.has(savedActiveId)
      ? savedActiveId
      : PUBLIC_SIGNATURES[0]?.id ?? null,
    addCustomSignature: (signature) => {
      const updated = [signature, ...get().customSignatures];
      persistCustomSignatures(updated);
      set({ customSignatures: updated });
    },
    deleteCustomSignature: (id) => {
      const signature = get().customSignatures.find((item) => item.id === id);
      if (!signature) return;
      const updated = get().customSignatures.filter((item) => item.id !== id);
      persistCustomSignatures(updated);
      const activeSignatureId = get().activeSignatureId === id
        ? PUBLIC_SIGNATURES[0]?.id ?? null
        : get().activeSignatureId;
      persistActiveId(activeSignatureId);
      set({ customSignatures: updated, activeSignatureId });
    },
    setActiveSignature: (id) => {
      const exists = id === null || publicIds.has(id) || get().customSignatures.some((item) => item.id === id);
      if (!exists) return;
      persistActiveId(id);
      set({ activeSignatureId: id });
    },
  };
});

export function getActiveSignature(signatures: SpectralSignature[], activeId: string | null) {
  return signatures.find((signature) => signature.id === activeId) ?? null;
}

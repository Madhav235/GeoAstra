import { create } from "zustand";
import { BUILT_IN_SCENES } from "../data/sceneCatalog";
import { removeCatalogSceneSelection, toggleCatalogSceneSelection } from "../services/mockSceneService";
import { SceneCatalogItem } from "../types";

const SELECTION_STORAGE_KEY = "geoastra_selected_scene_ids";
const knownSceneIds = new Set(BUILT_IN_SCENES.map((scene) => scene.id));

function loadSelectedIds(): string[] {
  try {
    const raw = localStorage.getItem(SELECTION_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string" && knownSceneIds.has(id));
  } catch (error) {
    console.error("Failed to load selected scene IDs:", error);
    return [];
  }
}

function persistSelectedIds(ids: string[]): void {
  try {
    localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error("Failed to persist selected scene IDs:", error);
  }
}

interface SceneCatalogState {
  selectedSceneIds: string[];
  uploadedScenes: SceneCatalogItem[];
  toggleSelectedScene: (id: string) => void;
  removeSelectedScene: (id: string) => void;
  clearSelectedScenes: () => void;
  addUploadedScene: (scene: SceneCatalogItem) => void;
}

export const useSceneCatalogStore = create<SceneCatalogState>((set, get) => ({
  selectedSceneIds: loadSelectedIds(),
  uploadedScenes: [],
  toggleSelectedScene: (id) => {
    const updated = toggleCatalogSceneSelection(get().selectedSceneIds, id);
    persistSelectedIds(updated);
    set({ selectedSceneIds: updated });
  },
  removeSelectedScene: (id) => {
    const updated = removeCatalogSceneSelection(get().selectedSceneIds, id);
    persistSelectedIds(updated);
    set({ selectedSceneIds: updated });
  },
  clearSelectedScenes: () => {
    persistSelectedIds([]);
    set({ selectedSceneIds: [] });
  },
  addUploadedScene: (scene) => set((state) => ({ uploadedScenes: [scene, ...state.uploadedScenes] })),
}));

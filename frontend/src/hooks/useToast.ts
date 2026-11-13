import { create } from "zustand";

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  variant?: ToastVariant;
  duration?: number; // ms
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => string;
  dismissToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = {
      id,
      duration: 4500,
      variant: "info",
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }

    return id;
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearAll: () => set({ toasts: [] }),
}));

/**
 * Convenient toast hook
 */
export function useToast() {
  const addToast = useToastStore((state) => state.addToast);
  const dismissToast = useToastStore((state) => state.dismissToast);
  const clearAll = useToastStore((state) => state.clearAll);

  return {
    toast: addToast,
    dismiss: dismissToast,
    clearAll,
    success: (title: string, message?: string) =>
      addToast({ title, message, variant: "success" }),
    error: (title: string, message?: string) =>
      addToast({ title, message, variant: "error" }),
    warning: (title: string, message?: string) =>
      addToast({ title, message, variant: "warning" }),
    info: (title: string, message?: string) =>
      addToast({ title, message, variant: "info" }),
  };
}


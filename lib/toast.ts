import { signal } from "@preact/signals";

export type ToastType = "default" | "success" | "error" | "warning" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  description?: string;
  /** Time in ms before auto-dismiss. Use Infinity to keep it open. */
  duration?: number;
  action?: ToastAction;
}

export interface ToastItem {
  id: number;
  title: string;
  type: ToastType;
  duration: number;
  description?: string;
  action?: ToastAction;
}

export const DEFAULT_DURATION = 4000;

export const toasts = signal<ToastItem[]>([]);

let counter = 0;

export function removeToast(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

function push(title: string, type: ToastType, options: ToastOptions = {}) {
  const id = ++counter;
  const item: ToastItem = {
    id,
    title,
    type,
    duration: options.duration ?? DEFAULT_DURATION,
    description: options.description,
    action: options.action,
  };
  // Newest on top of the stack.
  toasts.value = [item, ...toasts.value];
  return id;
}

export const toast = Object.assign(
  (title: string, options?: ToastOptions) => push(title, "default", options),
  {
    success: (title: string, options?: ToastOptions) =>
      push(title, "success", options),
    error: (title: string, options?: ToastOptions) =>
      push(title, "error", options),
    warning: (title: string, options?: ToastOptions) =>
      push(title, "warning", options),
    info: (title: string, options?: ToastOptions) =>
      push(title, "info", options),
    dismiss: removeToast,
  },
);

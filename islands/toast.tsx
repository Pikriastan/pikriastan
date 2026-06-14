import {
  CheckIcon,
  CloseIcon,
  InfoIcon,
  WarningIcon,
} from "@/components/icons.tsx";
import {
  removeToast,
  type ToastItem,
  toasts,
  type ToastType,
} from "@/lib/toast.ts";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

const EXIT_MS = 220;

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") return <CheckIcon />;
  if (type === "error") return <WarningIcon />;
  if (type === "warning") return <WarningIcon />;
  return <InfoIcon />;
}

function Toast({ item }: { item: ToastItem }) {
  const leaving = useSignal(false);

  function close() {
    if (leaving.value) {
      return;
    }
    leaving.value = true;
    setTimeout(() => removeToast(item.id), EXIT_MS);
  }

  useEffect(() => {
    if (item.duration === Infinity || item.duration <= 0) {
      return;
    }
    const timer = setTimeout(close, item.duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <output
      className={`toast toast-${item.type}${
        leaving.value ? " toast-leaving" : ""
      }`}
    >
      <span aria-hidden className="toast-icon">
        <ToastIcon type={item.type} />
      </span>
      <div className="toast-body">
        <p className="toast-title">{item.title}</p>
        {item.description && (
          <p className="toast-description">{item.description}</p>
        )}
        {item.action && (
          <button
            className="toast-action"
            onClick={() => {
              item.action?.onClick();
              close();
            }}
            type="button"
          >
            {item.action.label}
          </button>
        )}
      </div>
      <button
        aria-label="Dismiss"
        className="toast-close"
        onClick={close}
        type="button"
      >
        <CloseIcon />
      </button>
    </output>
  );
}

export function Toaster() {
  return (
    <div aria-live="polite" className="toaster" role="region">
      {toasts.value.map((item) => <Toast item={item} key={item.id} />)}
    </div>
  );
}

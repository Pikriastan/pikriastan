import { useSignal } from "@preact/signals";

export interface FormAction<TData, TError> {
  data: TData | null;
  error: TError | null;
}

export interface UseFormActionOptions<TData = unknown> {
  contentType?: "application/json" | "multipart/form-data";
  submitFunc?: (formData: FormData) => void;
  onSuccess?: (data: TData) => void;
  onError?: (message: string) => void;
}

export function useFormAction<TData = unknown, TError = unknown>(
  endpoint?: string,
  options: UseFormActionOptions<TData> = {},
) {
  const data = useSignal<TData | null>(null);
  const error = useSignal<TError | null>(null);
  const isPending = useSignal<boolean>(false);

  const resolveEndpoint = () =>
    endpoint ??
      (typeof window === "undefined" ? "" : globalThis.location.pathname);

  const execute = async (payload: FormData | Record<string, unknown>) => {
    if (isPending.value) {
      return;
    }

    isPending.value = true;
    error.value = null;

    try {
      const isJson = options.contentType === "application/json";
      const headers: Record<string, string> = {
        "X-Requested-With": "XMLHttpRequest",
      };

      if (isJson) {
        headers["Content-Type"] = "application/json";
      }

      const body = isJson && !(payload instanceof FormData)
        ? JSON.stringify(payload)
        : (payload as FormData);

      const response = await fetch(resolveEndpoint(), {
        method: "POST",
        headers,
        body,
      });

      const contentTypeHeader = response.headers.get("content-type") || "";
      let result;

      if (contentTypeHeader.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          result?.error || result || `Server error: ${response.status}`,
        );
      }

      data.value = result;
      options.onSuccess?.(result as TData);
      return result;
    } catch (err) {
      const msg = err instanceof Error
        ? err.message
        : "An unknown error occurred";
      error.value = msg as TError;
      options.onError?.(msg);
      throw err;
    } finally {
      isPending.value = false;
    }
  };

  // Automated attributes for standard <form> bindings
  const formProps = {
    action: resolveEndpoint(),
    method: "POST",
    onSubmit: async (e: SubmitEvent) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);

      if (typeof options.submitFunc !== "undefined") {
        await options.submitFunc(formData);
      }

      // Absorb the rejection so it doesn't cause uncaught runtime errors in console
      await execute(formData).catch(() => {});
    },
  };

  return [
    { data: data.value, error: error.value },
    formProps,
    isPending.value,
    execute,
  ] as const;
}

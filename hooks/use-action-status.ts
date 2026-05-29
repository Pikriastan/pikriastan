import { useEffect } from "react";
import { toast } from "sonner";

import type { BaseActionState } from "@/lib/action";

export const useActionStatus = (
  state: BaseActionState,
  onSuccess: () => void
) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed to include onSuccess
  useEffect(() => {
    if (state.status === "failed" || state.status === "invalid_data") {
      toast.error(state.message);
    } else if (state.status === "success") {
      toast.success(state.message);
      onSuccess();
    }
  }, [state]);
};

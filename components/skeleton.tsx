import { cn } from "@/lib/utils.ts";
import type { ComponentProps } from "preact";

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("skeleton", className)}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };

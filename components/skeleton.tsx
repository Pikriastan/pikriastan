import type { ComponentProps } from "preact";
import { cn } from "@/lib/utils.ts";

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

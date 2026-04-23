import { cn } from "@/lib/utils";
import * as React from "react";

export const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mx-auto w-full max-w-[1100px] px-6", className)}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";

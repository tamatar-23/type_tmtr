import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-opacity focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-text-primary text-background font-semibold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all",
        secondary: "border border-border bg-secondary-bg text-text-primary hover:bg-border/50",
        ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-secondary-bg/50",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-80",
        outline: "border border-border bg-transparent text-text-primary hover:bg-secondary-bg",
        default: "bg-text-primary text-background font-semibold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all",
        link: "text-text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2.5",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

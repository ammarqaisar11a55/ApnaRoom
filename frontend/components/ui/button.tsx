import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary-700 to-primary-500 text-white shadow-sm hover:shadow-lg active:scale-95",
        secondary: "bg-primary-50 text-primary-800 hover:bg-primary-100 dark:bg-primary-800 dark:text-primary-100 dark:hover:bg-primary-700",
        outline: "border border-slate-200 bg-white text-primary-800 hover:border-primary-200 hover:bg-primary-50 dark:border-slate-800 dark:bg-slate-950 dark:text-primary-100 dark:hover:bg-primary-900",
        ghost: "text-slate-700 hover:bg-primary-50 hover:text-primary-800 dark:text-slate-200 dark:hover:bg-primary-900",
        destructive: "bg-error-600 text-white hover:bg-error-700 active:scale-95",
      },
      size: {
        default: "h-10",
        sm: "h-9 px-3",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

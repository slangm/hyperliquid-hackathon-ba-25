"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-full text-sm font-semibold transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                default: "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)]",
                secondary:
                    "bg-white/10 text-white hover:bg-white/20 border border-white/20",
                outline:
                    "border border-white/20 text-white hover:bg-white/10 bg-transparent",
                ghost: "text-white hover:bg-white/10",
            },
            size: {
                default: "h-11 px-5",
                sm: "h-9 px-4 text-xs",
                lg: "h-12 px-6 text-base",
                icon: "h-10 w-10 p-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";

export { Button, buttonVariants };


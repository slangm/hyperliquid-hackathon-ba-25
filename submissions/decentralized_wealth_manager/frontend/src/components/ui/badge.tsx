"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border text-[11px] font-medium uppercase tracking-[0.3em]",
    {
        variants: {
            variant: {
                default: "border-white/20 bg-white/5 text-white/70 px-4 py-1",
                success: "border-[#7af7c9]/50 bg-[#7af7c9]/10 text-[#7af7c9]",
                warning: "border-[#F6C744]/50 bg-[#F6C744]/10 text-[#F6C744]",
                outline: "border-white/20 text-white/80 px-3 py-1",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

export function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}


"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "glass-panel gradient-border rounded-[28px] p-5 text-white",
            className,
        )}
        {...props}
    />
));
Card.displayName = "Card";

export const CardHeader = ({
    title,
    subtitle,
    action,
}: {
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
}) => (
    <div className="mb-4 flex items-center justify-between">
        <div>
            {subtitle && (
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
                    {subtitle}
                </p>
            )}
            {title && <h3 className="mt-1 text-lg font-semibold">{title}</h3>}
        </div>
        {action}
    </div>
);


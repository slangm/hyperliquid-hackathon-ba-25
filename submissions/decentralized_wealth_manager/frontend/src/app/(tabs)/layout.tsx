"use client";

import { MobileShell } from "@/components/layout/MobileShell";

export default function TabsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MobileShell>{children}</MobileShell>;
}


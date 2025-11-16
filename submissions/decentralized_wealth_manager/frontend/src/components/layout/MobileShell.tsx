"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Home,
    Layers,
    PiggyBank,
    UserRound,
} from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/invest", label: "Invest", icon: BarChart3 },
    { href: "/save", label: "Save", icon: PiggyBank },
    { href: "/vaults", label: "Vaults", icon: Layers },
    { href: "/copy", label: "Copy", icon: UserRound },
];

export function MobileShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen flex-col bg-[var(--background)]">
            <header className="sticky top-0 z-30 border-b border-white/5 bg-black/30 px-4 py-3 backdrop-blur">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
                            HyperFi
                        </p>
                        <p className="text-xl font-semibold text-white">Global Wealth</p>
                    </div>
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs text-emerald-200">
                        HyperEVM • Mainnet
                    </span>
                </div>
            </header>
            <main className="flex-1 px-4 pb-32 pt-6">{children}</main>
            <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/5 bg-black/70 px-3 py-3 backdrop-blur-md">
                <div className="grid grid-cols-5 gap-2">
                    {tabs.map((tab) => {
                        const active =
                            pathname === tab.href ||
                            (tab.href !== "/" && pathname.startsWith(tab.href));
                        const Icon = tab.icon;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    "relative flex flex-col items-center gap-1 rounded-2xl py-2 text-xs text-white/60",
                                    active && "text-white",
                                )}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="tab-pill"
                                        className="absolute inset-0 rounded-2xl bg-white/10"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <Icon className="z-10 h-5 w-5" />
                                <span className="z-10">{tab.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}


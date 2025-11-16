"use client";

import Link from "next/link";
import { ArrowUpRight, PiggyBank, Wallet } from "lucide-react";

import { AllocationChart } from "@/components/charts/AllocationChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useVaults } from "@/hooks/useVaults";

const quickActions = [
    { label: "Deposit", href: "/save", icon: Wallet },
    { label: "Withdraw", href: "/save", icon: PiggyBank },
    { label: "Convert", href: "/trade", icon: ArrowUpRight },
];

const roadmap = [
    {
        title: "Trade.xyz RAWs",
        description: "Fractional U.S. equities, paper mode.",
    },
    {
        title: "Ondo Top 100",
        description: "Tokenized global RWAs, index-like baskets.",
    },
    { title: "Copy Agents", description: "Tokenized PnL bots with guardrails." },
    { title: "BTC Hedge Vault", description: "Capital-protected BTC exposure." },
];

export default function HomePage() {
    const portfolio = usePortfolio();
    const vaultList = useVaults().slice(0, 3);

    return (
        <div className="space-y-6 pb-8">
            <section className="rounded-[32px] border border-white/10 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/40 p-6 text-white">
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">
                            Portfolio Value
                        </p>
                        <p className="text-4xl font-semibold">
                            ${portfolio.totalValue.toLocaleString()}
                        </p>
                        <p className="text-emerald-300 text-sm">
                            +{portfolio.changePct.toFixed(2)}% today
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm"
                                >
                                    <Icon className="h-4 w-4" />
                                    {action.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Card>
                <CardHeader title="Allocation" subtitle="Overview" />
                <AllocationChart />
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/80">
                    {portfolio.allocation.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{ background: item.color }}
                                />
                                {item.name}
                            </span>
                            <span>${item.value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card>
                <CardHeader
                    title="HyperFi Savings Account"
                    subtitle="Live"
                    action={
                        <Badge variant="success" className="tracking-normal">
                            APY 6.2%
                        </Badge>
                    }
                />
                <p className="text-sm text-white/80">
                    Automated HypurrFi looping vault with fintech safeguards. Deposits
                    loop to ~40% LTV and surface real-time telemetry.
                </p>
                <div className="mt-4 flex items-center gap-2">
                    <Button asChild>
                        <Link href="/save">Open Savings</Link>
                    </Button>
                    <Button variant="secondary" asChild>
                        <Link href="/vaults">View Vaults</Link>
                    </Button>
                </div>
            </Card>

            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
                            Vaults
                        </p>
                        <h3 className="text-xl font-semibold text-white">
                            Structured Product Lineup
                        </h3>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/vaults">
                            See all <ArrowUpRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <div className="space-y-3">
                    {vaultList.map((vault) => (
                        <Link
                            key={vault.id}
                            href={
                                vault.id === "savings" ? "/save" : `/vaults/${vault.id}`
                            }
                            className="block rounded-3xl border border-white/10 bg-white/5 p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white/60">{vault.tag}</p>
                                    <p className="text-lg font-semibold text-white">
                                        {vault.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-white">
                                        {vault.apy.toFixed(1)}%
                                    </p>
                                    <p className="text-xs text-white/60">{vault.risk} risk</p>
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-white/70">{vault.description}</p>
                        </Link>
                    ))}
                </div>
            </section>

            <section>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
                    Roadmap
                </p>
                <div className="mt-3 grid gap-3">
                    {roadmap.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent p-4"
                        >
                            <p className="text-sm font-semibold text-white">{item.title}</p>
                            <p className="text-xs text-white/70">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}


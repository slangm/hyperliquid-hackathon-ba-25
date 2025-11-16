"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStocks } from "@/hooks/useStocks";
import type { StockCategory } from "@/data/stocks";

const categories: { key: StockCategory | "all"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "tech", label: "Top Tech" },
    { key: "ai", label: "AI" },
    { key: "dividend", label: "Dividend" },
    { key: "pre-ipo", label: "Pre-IPO" },
];

export default function InvestPage() {
    const [filter, setFilter] = useState<StockCategory | "all">("all");
    const stocks = useStocks(filter === "all" ? undefined : filter);

    return (
        <div className="space-y-5 pb-8">
            <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
                    Invest
                </p>
                <h1 className="text-2xl font-semibold text-white">
                    Tokenized US Stocks & RAWs
                </h1>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setFilter(item.key)}
                        className={`rounded-full border px-4 py-2 text-sm ${filter === item.key
                                ? "border-white bg-white/20 text-white"
                                : "border-white/10 text-white/60"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <Card className="space-y-4">
                {stocks.map((stock) => (
                    <Link
                        key={stock.ticker}
                        href={`/stocks/${stock.ticker}`}
                        className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 hover:bg-white/5"
                    >
                        <div>
                            <p className="text-sm text-white/60">{stock.ticker}</p>
                            <p className="text-lg font-semibold text-white">{stock.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold text-white">
                                ${stock.price.toFixed(2)}
                            </p>
                            <p
                                className={`text-sm ${stock.changePct >= 0 ? "text-emerald-300" : "text-rose-300"
                                    }`}
                            >
                                {stock.changePct >= 0 ? "+" : ""}
                                {stock.changePct.toFixed(2)}%
                            </p>
                        </div>
                    </Link>
                ))}
            </Card>

            <Button variant="secondary" className="w-full" asChild>
                <Link href="/copy">Browse Copy Agents</Link>
            </Button>
        </div>
    );
}


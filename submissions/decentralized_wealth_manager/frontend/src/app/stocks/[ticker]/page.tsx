"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { stocks } from "@/data/stocks";

export default function StockDetail({
    params,
}: {
    params: { ticker: string };
}) {
    const stock = stocks.find(
        (item) => item.ticker.toLowerCase() === params.ticker.toLowerCase(),
    );

    const chartData = useMemo(
        () =>
            Array.from({ length: 20 }).map((_, idx) => ({
                value:
                    stock?.price || 0 + Math.sin(idx / 2) * (stock?.changePct ?? 1) * 0.3,
            })),
        [stock],
    );

    if (!stock) {
        notFound();
    }

    return (
        <div className="space-y-5 px-4 pb-8 pt-6">
            <Button variant="ghost" asChild>
                <Link href="/invest">← Back to Invest</Link>
            </Button>

            <header className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
                    {stock.ticker}
                </p>
                <h1 className="text-3xl font-semibold text-white">{stock.name}</h1>
                <p className="text-lg text-white/80">${stock.price.toFixed(2)}</p>
                <p
                    className={`text-sm ${stock.changePct >= 0 ? "text-emerald-300" : "text-rose-300"
                        }`}
                >
                    {stock.changePct >= 0 ? "+" : ""}
                    {stock.changePct}% (24h)
                </p>
            </header>

            <Card>
                <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#53F4D0"
                                fillOpacity={0.2}
                                fill="#53F4D0"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex gap-2">
                    <Button className="flex-1">Buy (Paper)</Button>
                    <Button variant="secondary" className="flex-1">
                        Sell
                    </Button>
                </div>
            </Card>

            <Card className="space-y-3">
                <h3 className="text-lg font-semibold text-white">About</h3>
                <p className="text-sm text-white/70">
                    Fractional RAW exposure to {stock.name}. Paper trading mode shows how
                    Trade.xyz order flow will embed into HyperFi.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
                    <div>
                        <p className="text-white/50">Dividend Yield</p>
                        <p>{stock.dividendYield ? `${stock.dividendYield}%` : "—"}</p>
                    </div>
                    <div>
                        <p className="text-white/50">Category</p>
                        <p>{stock.category.join(", ")}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}


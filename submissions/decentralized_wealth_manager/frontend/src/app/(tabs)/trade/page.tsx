"use client";

import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const chartData = Array.from({ length: 40 }).map((_, idx) => ({
    value: 64442 + Math.sin(idx / 4) * 320,
}));

export default function TradePage() {
    const [side, setSide] = useState<"buy" | "sell">("buy");

    return (
        <div className="space-y-5 pb-8">
            <header className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
                    Trade
                </p>
                <h1 className="text-3xl font-semibold text-white">
                    Hyperliquid Spot & Perps
                </h1>
                <p className="text-sm text-white/70">
                    Mobile-friendly order entry for BTC, ETH, and RWAs. Hooking into
                    Hyperliquid order books post-hackathon; currently visual demo.
                </p>
            </header>

            <Card>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-white/60">BTC</p>
                        <p className="text-3xl font-semibold text-white">$64,442</p>
                    </div>
                    <p className="text-emerald-300">+1.24%</p>
                </div>
                <div className="mt-4 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#53F4D0"
                                fill="#53F4D0"
                                fillOpacity={0.2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="space-y-3">
                <div className="flex gap-2">
                    <Button
                        className="flex-1"
                        variant={side === "buy" ? "default" : "secondary"}
                        onClick={() => setSide("buy")}
                    >
                        Buy
                    </Button>
                    <Button
                        className="flex-1"
                        variant={side === "sell" ? "default" : "secondary"}
                        onClick={() => setSide("sell")}
                    >
                        Sell
                    </Button>
                </div>
                <label className="text-sm text-white/60">Order Size (BTC)</label>
                <input
                    className="rounded-2xl border border-white/20 bg-black/30 p-4 text-2xl font-semibold text-white outline-none"
                    placeholder="0.10"
                />
                <Button disabled>Submit (paper)</Button>
            </Card>
        </div>
    );
}


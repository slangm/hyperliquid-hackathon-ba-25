"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useVaults } from "@/hooks/useVaults";

export default function VaultsPage() {
  const vaults = useVaults();

  return (
    <div className="space-y-5 pb-8">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
          Vaults
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Structured Product Marketplace
        </h1>
        <p className="text-sm text-white/70">
          Mix fixed-yield, range-bound, and momentum strategies. Savings Account
          is live today; others are in coming-soon paper mode.
        </p>
      </header>

      <div className="space-y-4">
        {vaults.map((vault) => (
          <Card
            key={vault.id}
            className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">{vault.tag}</p>
                <p className="text-xl font-semibold text-white">
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
            <p className="text-sm text-white/70">{vault.description}</p>
            <div className="flex items-center justify-between">
              <Badge variant={vault.status === "live" ? "success" : "outline"}>
                {vault.status === "live" ? "Live" : "Coming Soon"}
              </Badge>
              <Link
                href={vault.id === "savings" ? "/save" : `/vaults/${vault.id}`}
                className="inline-flex items-center gap-2 text-sm text-[var(--accent)]"
              >
                {vault.status === "live" ? "Enter vault" : "Preview strategy"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}


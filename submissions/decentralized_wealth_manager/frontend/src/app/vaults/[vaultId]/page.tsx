"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { vaults } from "@/data/vaults";

export default function VaultDetail({
  params,
}: {
  params: { vaultId: string };
}) {
  const vault = vaults.find((v) => v.id === params.vaultId);
  if (!vault) notFound();

  return (
    <div className="space-y-5 px-4 pb-10 pt-6">
      <Button variant="ghost" asChild>
        <Link href="/vaults">← Back to vaults</Link>
      </Button>
      <header className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
          {vault?.tag}
        </p>
        <h1 className="text-3xl font-semibold text-white">{vault?.name}</h1>
        <p className="text-white/70">{vault?.description}</p>
      </header>

      <Card className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
          <div>
            <p className="text-white/50">APY</p>
            <p className="text-2xl font-bold">{vault?.apy.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-white/50">Risk Level</p>
            <p className="text-lg">{vault?.risk}</p>
          </div>
          <div>
            <p className="text-white/50">TVL (demo)</p>
            <p>${vault?.tvl.toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-white/50">Status</p>
            <p>{vault?.status === "live" ? "Live" : "Coming soon"}</p>
          </div>
        </div>
        <p className="text-sm text-white/70">
          Strategy breakdown will display hedging mix, leverage, and oracle
          inputs. For the hackathon, this page acts as a preview for investors.
        </p>
        <Button disabled={vault?.status !== "live"} asChild>
          <Link href={vault?.id === "savings" ? "/save" : "#"}>
            {vault?.status === "live" ? "Enter vault" : "Join waitlist"}
          </Link>
        </Button>
      </Card>
    </div>
  );
}


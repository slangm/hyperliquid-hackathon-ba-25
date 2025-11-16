"use client";

import { AlertTriangle } from "lucide-react";

import { SavingsVaultPanel } from "@/components/modules/SavingsVaultPanel";

export default function SavePage() {
  return (
    <div className="space-y-5 pb-10">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
          Save
        </p>
        <h1 className="text-3xl font-semibold text-white">
          HyperFi Savings Account
        </h1>
        <p className="text-sm text-white/70">
          Automated looping vault backed by HypurrFi. Deposit USDC, borrow
          against it, and maintain a 40% target LTV with smart monitoring.
        </p>
      </header>

      <div className="rounded-3xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-amber-100">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p>
            HypurrFi currently rejects contract-initiated deposits on the USDC
            reserve (panic 0x11). Use this UI in demo/paper mode or deposit via
            HypurrFi directly while the team patches `Pool.supply`.
          </p>
        </div>
      </div>

      <SavingsVaultPanel />
    </div>
  );
}


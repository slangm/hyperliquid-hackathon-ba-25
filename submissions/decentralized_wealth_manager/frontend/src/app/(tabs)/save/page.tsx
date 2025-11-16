"use client";

import { SavingsVaultPanel } from "@/components/modules/SavingsVaultPanel";

export default function SavePage() {
  return (
    <div className="space-y-5 pb-10">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
          Save
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold text-white">
            HyperFi Savings Account
          </h1>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm text-white">
            7.5% APY
          </span>
        </div>
        <p className="text-sm text-white/70">
          Automated looping vault backed by HypurrFi. Deposit USDC, borrow
          against it, and maintain a 40% target LTV with smart monitoring.
        </p>
      </header>

      <SavingsVaultPanel />
    </div>
  );
}


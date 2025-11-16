"use client";

import Link from "next/link";

import { Card } from "@/components/ui/card";
import { useAgents } from "@/hooks/useAgents";

export default function CopyPage() {
  const agents = useAgents();
  return (
    <div className="space-y-5 pb-8">
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
          Copy
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Tokenized PnL Agents
        </h1>
        <p className="text-sm text-white/70">
          Mirror professional strategies with transparent drawdowns. Tokenized
          PnL contracts let you allocate in one tap (paper mode for demo).
        </p>
      </header>

      <div className="space-y-3">
        {agents.map((agent) => (
          <Link key={agent.id} href={`/copy/${agent.id}`}>
            <Card className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-sm text-white/60">{agent.strategy}</p>
                <p className="text-lg font-semibold text-white">
                  {agent.handle}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-emerald-300">
                  +{agent.return30d.toFixed(1)}%
                </p>
                <p className="text-xs text-white/60">
                  {agent.copiers.toLocaleString()} copiers
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}


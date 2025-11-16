"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { agents } from "@/data/agents";

export default function AgentDetail({
  params,
}: {
  params: { agentId: string };
}) {
  const agent = agents.find((a) => a.id === params.agentId);
  if (!agent) notFound();

  const chartData = Array.from({ length: 30 }).map((_, idx) => ({
    value:
      agent.return30d / 2 +
      Math.sin(idx / 3) * agent.return30d * 0.2 +
      idx * 0.2,
  }));

  return (
    <div className="space-y-5 px-4 pb-12 pt-6">
      <Button variant="ghost" asChild>
        <Link href="/copy">← Back to agents</Link>
      </Button>
      <header className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
          {agent.strategy}
        </p>
        <h1 className="text-3xl font-semibold text-white">{agent.handle}</h1>
        <p className="text-sm text-white/70">
          Performance: +{agent.return30d.toFixed(1)}% (30d) • Max drawdown{" "}
          {agent.maxDrawdown}%
        </p>
      </header>

      <Card>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#A778FF"
                fill="#A778FF"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-sm text-white/70">
          Copy trading enters paper mode orders that mirror this agent’s
          strategy. Tokenized PnL contracts settle via Hyperliquid under the
          hood once live.
        </p>
        <Button className="mt-4 w-full" disabled>
          Copy (coming soon)
        </Button>
      </Card>
    </div>
  );
}


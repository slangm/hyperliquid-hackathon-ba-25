"use client";

import { useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  usePublicClient,
  useReadContract,
  useReadContracts,
  useWriteContract,
} from "wagmi";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import { ArrowDownCircle, RefreshCw, Shield } from "lucide-react";

import { hypurrVaultAbi } from "@/abis/hypurrVault";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { vaultAddress, usdcAddress } from "@/config/addresses";

const USDC_DECIMALS = 6;
const SHARE_DECIMALS = 18;

const getErrorMessage = (error: unknown) => {
  if (!error) return "Transaction failed";
  if (
    typeof error === "object" &&
    error !== null &&
    "shortMessage" in error &&
    typeof (error as { shortMessage?: string }).shortMessage === "string"
  ) {
    return (error as { shortMessage: string }).shortMessage;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: string }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Transaction failed";
};

export function SavingsVaultPanel() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, status } = useConnect();
  const { disconnect } = useDisconnect();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [depositAmount, setDepositAmount] = useState("500");
  const [withdrawAmount, setWithdrawAmount] = useState("250");
  const [message, setMessage] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ action: string; hash: `0x${string}` }[]>(
    [],
  );

  const primaryConnector =
    connectors.find((c) => c.ready) ?? connectors.at(0) ?? null;

  const { data: walletBalance } = useBalance({
    address,
    token: usdcAddress,
    query: { enabled: !!address },
  });

  const { data: vaultStats, refetch: refetchStats } = useReadContracts({
    allowFailure: false,
    contracts: [
      { address: vaultAddress, abi: hypurrVaultAbi, functionName: "totalAssets" },
      { address: vaultAddress, abi: hypurrVaultAbi, functionName: "totalSupply" },
      {
        address: vaultAddress,
        abi: hypurrVaultAbi,
        functionName: "currentLtvBps",
      },
      {
        address: vaultAddress,
        abi: hypurrVaultAbi,
        functionName: "targetLtvBps",
      },
      { address: vaultAddress, abi: hypurrVaultAbi, functionName: "maxLtvBps" },
      {
        address: vaultAddress,
        abi: hypurrVaultAbi,
        functionName: "rebalanceThresholdBps",
      },
    ] as const,
  });

  const {
    data: userShares,
    refetch: refetchShares,
    isLoading: loadingShares,
  } = useReadContract({
    address: vaultAddress,
    abi: hypurrVaultAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const {
    data: allowance,
    refetch: refetchAllowance,
    isLoading: loadingAllowance,
  } = useReadContract({
    address: usdcAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: address ? [address, vaultAddress] : undefined,
    query: { enabled: !!address },
  });

  const stats = useMemo(() => {
    if (!vaultStats) {
      return null;
    }
    const [
      totalAssets,
      totalSupply,
      currentLtv,
      targetLtv,
      maxLtv,
      threshold,
    ] = vaultStats as bigint[];

    return {
      tvl: Number(formatUnits(totalAssets, USDC_DECIMALS)),
      sharePrice:
        Number(totalSupply) > 0
          ? Number(totalAssets) / Number(totalSupply)
          : 1,
      currentLtv: Number(currentLtv) / 100,
      targetLtv: Number(targetLtv) / 100,
      maxLtv: Number(maxLtv) / 100,
      threshold: Number(threshold) / 100,
    };
  }, [vaultStats]);

  const ensureWallet = () => {
    if (isConnected && address) return true;
    if (!primaryConnector) {
      setMessage("No injected wallet detected. Please install MetaMask or Rabby.");
      return false;
    }
    connect({ connector: primaryConnector });
    return false;
  };

  const handleDeposit = async () => {
    if (!ensureWallet()) return;
    try {
      const amount = parseUnits(depositAmount || "0", USDC_DECIMALS);
      if (amount <= 0n) {
        setMessage("Enter an amount greater than zero.");
        return;
      }
      if ((allowance ?? 0n) < amount) {
        setMessage("Approving vault to spend USDC…");
        const approveTx = await writeContractAsync({
          address: usdcAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [vaultAddress, amount],
        });
        await publicClient?.waitForTransactionReceipt({ hash: approveTx });
        await refetchAllowance();
      }
      setMessage("Depositing into HyperFi Savings Account…");
      const depositTx = await writeContractAsync({
        address: vaultAddress,
        abi: hypurrVaultAbi,
        functionName: "deposit",
        args: [amount, address!],
      });
      await publicClient?.waitForTransactionReceipt({ hash: depositTx });
      setMessage("Deposit confirmed");
      setLogs((prev) => [
        { action: `Deposited ${depositAmount} USDC`, hash: depositTx },
        ...prev.slice(0, 4),
      ]);
      await Promise.all([refetchStats(), refetchShares()]);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const handleWithdraw = async () => {
    if (!ensureWallet()) return;
    try {
      const amount = parseUnits(withdrawAmount || "0", USDC_DECIMALS);
      setMessage("Submitting withdraw…");
      const hash = await writeContractAsync({
        address: vaultAddress,
        abi: hypurrVaultAbi,
        functionName: "withdraw",
        args: [amount, address!, address!],
      });
      await publicClient?.waitForTransactionReceipt({ hash });
      setMessage("Withdrawal confirmed");
      setLogs((prev) => [
        { action: `Withdrew ${withdrawAmount} USDC`, hash },
        ...prev.slice(0, 4),
      ]);
      await Promise.all([refetchStats(), refetchShares()]);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-5">
      <Card className="space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
              HyperFi Savings
            </p>
            <h2 className="text-2xl font-semibold text-white">
              Leveraged Yield Strategy
            </h2>
          </div>
          <Badge variant="warning">Live</Badge>
        </header>
        <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
          <div>
            <p className="text-white/50">Vault TVL</p>
            <p className="text-lg font-semibold">
              ${stats ? stats.tvl.toLocaleString() : "—"}
            </p>
          </div>
          <div>
            <p className="text-white/50">Share price</p>
            <p className="text-lg font-semibold">
              ${stats ? stats.sharePrice.toFixed(3) : "—"}
            </p>
          </div>
          <div>
            <p className="text-white/50">Target LTV</p>
            <p>{stats ? `${stats.targetLtv.toFixed(2)}%` : "—"}</p>
          </div>
          <div>
            <p className="text-white/50">Rebalance band</p>
            <p>{stats ? `${stats.threshold.toFixed(2)}%` : "—"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {isConnected ? (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => disconnect()}
            >
              Disconnect {address?.slice(0, 6)}…{address?.slice(-4)}
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() =>
                primaryConnector
                  ? connect({ connector: primaryConnector })
                  : setMessage("No injected wallet detected.")
              }
              disabled={status === "pending"}
            >
              {status === "pending" ? "Connecting…" : "Connect Wallet"}
            </Button>
          )}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
                Deposit
              </p>
              <h3 className="text-xl font-semibold text-white">Add USDC</h3>
            </div>
            <ArrowDownCircle className="h-8 w-8 text-[var(--accent)]" />
          </div>
          <label className="text-sm text-white/60">Amount (USDC)</label>
          <input
            className="rounded-2xl border border-white/20 bg-black/30 p-4 text-2xl font-semibold text-white outline-none"
            value={depositAmount}
            type="number"
            min="0"
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <p className="text-xs text-white/50">
            Wallet balance:{" "}
            {walletBalance
              ? `${Number(walletBalance.formatted).toFixed(2)} USDC`
              : "—"}
          </p>
          <Button className="w-full" onClick={handleDeposit}>
            Deposit & Loop
          </Button>
          <p className="text-xs text-white/50">
            {loadingAllowance
              ? "Fetching allowance…"
              : `Allowance: ${
                  allowance
                    ? Number(formatUnits(allowance, USDC_DECIMALS)).toFixed(2)
                    : 0
                } USDC`}
          </p>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
                Withdraw
              </p>
              <h3 className="text-xl font-semibold text-white">Unwind loop</h3>
            </div>
            <RefreshCw className="h-8 w-8 text-[var(--accent)]" />
          </div>
          <label className="text-sm text-white/60">Amount (USDC)</label>
          <input
            className="rounded-2xl border border-white/20 bg-black/30 p-4 text-2xl font-semibold text-white outline-none"
            value={withdrawAmount}
            type="number"
            min="0"
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <p className="text-xs text-white/50">
            Vault shares:{" "}
            {loadingShares
              ? "…"
              : userShares
                ? Number(formatUnits(userShares, SHARE_DECIMALS)).toFixed(4)
                : "—"}
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleWithdraw}
            disabled={!userShares || userShares === 0n}
          >
            Withdraw to Wallet
          </Button>
        </Card>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
              Risk Monitor
            </p>
            <h3 className="text-xl font-semibold text-white">
              Guardrails & Alerts
            </h3>
          </div>
          <Shield className="h-6 w-6 text-emerald-300" />
        </div>
        <ul className="space-y-2 text-sm text-white/70">
          <li>• Target LTV 40% with rebalance at ±5%.</li>
          <li>
            • Automatic deleveraging hooks ready for keeper bots (post-hackathon).
          </li>
          <li>
            • Temporary limitation: Hypurr Pool currently reverts contract-based
            supplies (see Known Issues).
          </li>
        </ul>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        {logs.length === 0 && (
          <p className="text-sm text-white/60">No on-chain activity yet.</p>
        )}
        {logs.map((entry) => (
          <div
            key={entry.hash}
            className="flex items-center justify-between text-sm text-white/70"
          >
            <span>{entry.action}</span>
            <a
              className="text-[var(--accent)]"
              href={`https://hyperevmscan.io/tx/${entry.hash}`}
              target="_blank"
              rel="noreferrer"
            >
              View
            </a>
          </div>
        ))}
        {message && (
          <p className="rounded-2xl border border-white/10 bg-black/40 p-3 text-xs text-white/70">
            {message}
          </p>
        )}
      </Card>
    </div>
  );
}


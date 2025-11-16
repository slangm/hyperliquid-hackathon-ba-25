export type RiskLevel = "Low" | "Medium" | "High";

export type VaultItem = {
    id: string;
    name: string;
    tag: string;
    apy: number;
    description: string;
    risk: RiskLevel;
    tvl: number;
    status?: "live" | "coming-soon";
};

export const vaults: VaultItem[] = [
    {
        id: "savings",
        name: "HyperFi Savings Account",
        tag: "Live",
        apy: 6.2,
        description: "Market-neutral looping powered by HypurrFi.",
        risk: "Low",
        tvl: 1.4,
        status: "live",
    },
    {
        id: "fixed-yield",
        name: "10% Fixed Yield Vault",
        tag: "Hedged Options",
        apy: 10,
        description: "Funding-rate capture blended with short-dated options.",
        risk: "Low",
        tvl: 12.4,
        status: "coming-soon",
    },
    {
        id: "eth-range",
        name: "ETH Range-Bound",
        tag: "Range Note",
        apy: 23.4,
        description: "Earn double-digit APY when ETH stays between 2.4k–3.0k.",
        risk: "Medium",
        tvl: 8.1,
        status: "coming-soon",
    },
    {
        id: "btc-trend",
        name: "BTC Trend Vault",
        tag: "Momentum",
        apy: 42.5,
        description: "Auto-leveraged long posture when on-chain momentum flashes green.",
        risk: "High",
        tvl: 4.2,
        status: "coming-soon",
    },
    {
        id: "pre-ipo",
        name: "Pre-IPO Equity Vault",
        tag: "RAW Basket",
        apy: 6.1,
        description: "Curated exposure to SpaceX, OpenAI, and top private names.",
        risk: "Medium",
        tvl: 3.7,
        status: "coming-soon",
    },
];


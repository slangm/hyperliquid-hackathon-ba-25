export type AgentItem = {
    id: string;
    handle: string;
    strategy: string;
    return30d: number;
    copiers: number;
    maxDrawdown: number;
};

export const agents: AgentItem[] = [
    {
        id: "crypto-sam",
        handle: "@CryptoSam",
        strategy: "AI Momentum",
        return30d: 44.3,
        copiers: 2442,
        maxDrawdown: -4.1,
    },
    {
        id: "arb-queen",
        handle: "@ArbQueen",
        strategy: "Delta-Neutral Funding",
        return30d: 28.1,
        copiers: 1132,
        maxDrawdown: -2.4,
    },
    {
        id: "delta-neutral",
        handle: "@DeltaNeutral",
        strategy: "Basis Capture",
        return30d: 12.8,
        copiers: 5221,
        maxDrawdown: -1.8,
    },
    {
        id: "momentum-bot",
        handle: "HYPE Momentum Bot",
        strategy: "Quant Momentum",
        return30d: 18.5,
        copiers: 893,
        maxDrawdown: -3.9,
    },
];


import { defineChain } from "viem";

import { hyperRpcUrl } from "./addresses";

export const hyperEvm = defineChain({
    id: 999,
    name: "HyperEVM",
    nativeCurrency: {
        name: "HYPE",
        symbol: "HYPE",
        decimals: 18,
    },
    rpcUrls: {
        default: { http: [hyperRpcUrl] },
        public: { http: [hyperRpcUrl] },
    },
    blockExplorers: {
        default: {
            name: "Hyper Explorer",
            url: "https://app.hyperliquid.xyz/explorer",
        },
    },
});


export const vaultAddress =
    (process.env.NEXT_PUBLIC_VAULT_ADDRESS as `0x${string}`) ??
    ("0x98055D5c1Fa769222B723AE3f4Da4f43e7340190" as const);

export const usdcAddress =
    (process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`) ??
    ("0xb88339CB7199b77E23DB6E890353E22632Ba630f" as const);

export const hyperRpcUrl =
    process.env.NEXT_PUBLIC_HYPER_RPC_URL ??
    "https://hyperliquid-mainnet.g.alchemy.com/v2/ZkMH-p7ow1QdAc147vW9V";


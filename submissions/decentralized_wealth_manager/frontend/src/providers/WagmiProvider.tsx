"use client";

import { PropsWithChildren, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider as RootWagmiProvider } from "wagmi";

import { queryClient, wagmiConfig } from "@/lib/wagmi";

export function WagmiProvider({ children }: PropsWithChildren) {
    const [client] = useState(() => queryClient);

    return (
        <RootWagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={client}>{children}</QueryClientProvider>
        </RootWagmiProvider>
    );
}


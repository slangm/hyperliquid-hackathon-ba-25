import { QueryClient } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";

import { hyperEvm } from "@/config/hyperChain";
import { hyperRpcUrl } from "@/config/addresses";

export const wagmiConfig = createConfig({
    chains: [hyperEvm],
    connectors: [injected()],
    transports: {
        [hyperEvm.id]: http(hyperRpcUrl),
    },
    multiInjectedProviderDiscovery: false,
});

export const queryClient = new QueryClient();


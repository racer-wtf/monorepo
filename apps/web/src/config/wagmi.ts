import { cookieStorage, createStorage } from "wagmi";
import { http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

import { env } from "@/env";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

const chains = [mainnet, sepolia] as const;

const wagmiConfig = {
  chains,
  transports: {
    [mainnet.id]: http(env.NEXT_PUBLIC_MAINNET_RPC_URL),
    [sepolia.id]: http(env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
  },
  ssr: true,
};

export const config = defaultWagmiConfig({
  projectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  metadata: {
    name: "Racer",
    description: "Worldwide DeFi primitives.",
    url: env.NEXT_PUBLIC_SITE_URL,
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
  ...wagmiConfig,
});
